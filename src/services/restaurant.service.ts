import { FilterQuery, UpdateQuery } from 'mongoose';
import Restaurant, { RestaurantType } from '../models/restaurant';

const findById = async (id: string) => {
  const restaurant = await Restaurant.findById(id);
  return restaurant;
}

const findRestaurant = async ({ user_id }: { user_id: string }) => {
  const restaurant = await Restaurant.findOne({ user: user_id });
  return restaurant;
}

const createRestaurant = async (data: Partial<RestaurantType>) => {
  const restaurant = await Restaurant.create(data)
  return restaurant;
}

const updateRestaurant = async (
  query: FilterQuery<RestaurantType>, 
  update: UpdateQuery<RestaurantType>
) => {
  const updated = await Restaurant.findOneAndUpdate(query, update);
  return updated;
}

export default { findById, findRestaurant, createRestaurant, updateRestaurant }
