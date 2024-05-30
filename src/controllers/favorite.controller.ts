import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { FavoriteType } from '../schema/favorite.schema';
import { RestaurantService, FavoriteService } from '../services';

async function checkFavorite(
  req: Request<FavoriteType, {}, {}>, 
  res: Response
) {
  const user_id = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const isBookmarked = await FavoriteService.findFavorite({ 
      user: new mongoose.Types.ObjectId(user_id), 
      restaurant: restaurant._id, 
    });
    if (!isBookmarked) return res.status(404).json({ msg: 'Restaurant is not bookmarked' });

    return res.status(200).json({ 
      msg: 'Restaurant is bookmarked', 
      data: isBookmarked,  
    });
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}

async function addFavorite(
  req: Request<FavoriteType, {}, {}>, 
  res: Response
) {
  const user_id = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const favorite = await FavoriteService.createFave({ 
      user: new mongoose.Types.ObjectId(user_id), 
      restaurant: restaurant._id, 
    });

    if (!favorite) return res.status(400).send({ msg: 'Failed to add to favorites' });

    return res.status(201).send({ msg: 'Added to favorites' });
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}

async function deleteFavorite(
  req: Request<FavoriteType, {}, {}>, 
  res: Response
) {
  const user_id = req.userId;
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantService.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant does not exist' });

    const removed = await FavoriteService.removeFave({ 
      user: new mongoose.Types.ObjectId(user_id), 
      restaurant: restaurant._id, 
    });

    if (!removed) return res.status(400).send({ msg: 'Failed to remove from favorites' });

    return res.status(200).send({ msg: 'Removed from favorites' });
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}

export default { checkFavorite, addFavorite, deleteFavorite, }
