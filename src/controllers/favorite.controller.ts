import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { RestaurantService, FavoritesService } from '../services';
import { log } from '../utils';
import { SearchType } from '../schema/restaurant.schema';

// TODO: for dev purposes only, remove later
async function getAll(_req: Request, res: Response) {
  try {
    const bookmarks = await FavoritesService.findAll();
    res.json(bookmarks);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function getUserBookmarks(req: Request, res: Response) {
  try {
    const user = req.userId;
    const favorites = await FavoritesService.getUserFavorites(user);
    if (!favorites) return res.status(404).send([]);
    const restaurants = await Promise.all(favorites.map(async (favorite) => {
      const restaurant = await RestaurantService.findRestauntById(String(favorite.restaurant));
      return restaurant;
    }));
    res.status(200).json(restaurants);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function checkFavorite(
  req: Request<SearchType, {}, {}>, 
  res: Response
) {
  const userId = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findRestauntById(restaurantId as string);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const isBookmarked = await FavoritesService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!isBookmarked) return res.status(404).json({ bookmarked: false });

    res.status(200).json({ bookmarked: true });
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function addFavorite(
  req: Request<SearchType, {}, {}>, 
  res: Response
) {
  const userId = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findRestauntById(restaurantId as string);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const isBookmarked = await FavoritesService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (isBookmarked) return res.status(400).json({ msg: 'Restaurant is already bookmarked' });

    const favorite = await FavoritesService.createFave({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!favorite) {
      return res.status(400).send({ msg: 'Failed to add to favorites' });
    }

    res.status(201).send({ msg: 'Added to favorites' });
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function deleteFavorite(
  req: Request<SearchType, {}, {}>, 
  res: Response
) {
  const userId = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findRestauntById(restaurantId as string);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const bookmark = await FavoritesService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!bookmark) {
      return res.status(400).json({ msg: 'Restaurant is not bookmarked' });
    }

    await bookmark.deleteOne();

    res.status(200).send({ msg: 'Removed from favorites' });
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

export default { 
  checkFavorite, 
  addFavorite, 
  deleteFavorite, 
  getAll, 
  getUserBookmarks, 
}
