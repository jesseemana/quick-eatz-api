import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { RestaurantService, FavoriteService } from '../services';
import { log } from '../utils';
import { SearchType } from '../schema/restaurant.schema';
import Favorite from '../models/favorites';

// TODO: remove later, for dev purposes only
async function getAll(_req: Request, res: Response) {
  try {
    const bookmarks = await Favorite.find({});
    return res.json(bookmarks);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function getUserBookmarks(req: Request, res: Response) {
  try {
    const user = req.userId;
    const favorites = await FavoriteService.getUserFavorites(user);
    if (!favorites) return res.status(404).send({ msg: 'User has no bookmarks' });
    const restaurants = await Promise.all(favorites.map(async (favorite) => {
      const restaurant = await RestaurantService.findRestauntById(String(favorite.restaurant));
      return restaurant;
    }));
    return res.status(200).json(restaurants);
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

    const isBookmarked = await FavoriteService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!isBookmarked) return res.status(404).json({ 
      msg: 'Restaurant is not bookmarked',
      bookmarked: false,
    });

    return res.status(200).json({ 
      msg: 'Restaurant is bookmarked', 
      bookmarked: true,  
    });
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

    const isBookmarked = await FavoriteService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (isBookmarked) return res.status(400).json({ msg: 'Restaurant is already bookmarked' });

    const favorite = await FavoriteService.createFave({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!favorite) {
      return res.status(400).send({ msg: 'Failed to add to favorites' });
    }

    return res.status(201).send({ msg: 'Added to favorites' });
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

    const bookmark = await FavoriteService.findFavorite({ 
      user: new mongoose.Types.ObjectId(userId), 
      restaurant: restaurant._id, 
    });
    if (!bookmark) {
      return res.status(400).json({ msg: 'Restaurant is not bookmarked' });
    }

    await bookmark.deleteOne();

    return res.status(200).send({ msg: 'Removed from favorites' });
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
