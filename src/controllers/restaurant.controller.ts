import { Request, Response } from 'express';
import Restaurant from '../models/restaurant';
import { RestaurantType } from '../schema/restaurant.schema';


const getRestaurant = async (
  req: Request<RestaurantType['params'], {}, {}>, 
  res: Response
) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'restaurant not found' });

    return res.json(restaurant);
  } catch (error) {
    console.log('An error occured', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const searchRestaurant = async (
  req: Request<RestaurantType['params'], {}, {}>, 
  res: Response
) => {
  try {
    const { city } = req.params;

  } catch (error) {
    console.log('An error occured', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export default {
  getRestaurant,
  searchRestaurant,
};
