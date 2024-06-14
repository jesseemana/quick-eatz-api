import { FilterQuery, UpdateQuery } from 'mongoose';
import Restaurant, { RestaurantType } from '../models/restaurant';

const findRestauntById= async (id: string) => {
  const restaurant = await Restaurant.findById(id);
  return restaurant;
}

const searchRestaurant = async ({ query, skip, limit, sortOption }: { 
  query: any, 
  skip: number, 
  limit: number, 
  sortOption: string 
}) => {
  const restaurants = await Restaurant.find(query)
    .sort({ [sortOption]: 1 })
    .limit(limit)
    .skip(skip)
    .lean();
  return restaurants;
}

const findRestaurant = async (user_id: string) => {
  const restaurant = await Restaurant.findOne({ user: user_id });
  return restaurant;
}

const createRestaurant = async (data: Partial<RestaurantType>) => {
  const restaurant = await Restaurant.create(data)
  return restaurant;
}

async function countRestaurants(query: any) {
  const total = await Restaurant.countDocuments(query);
  return total;
}

const updateRestaurant = async (
  query: FilterQuery<RestaurantType>, 
  update: UpdateQuery<RestaurantType>
) => {
  const updated = await Restaurant.findOneAndUpdate(query, update);
  return updated;
}

export default { 
  searchRestaurant,
  findRestauntById, 
  findRestaurant, 
  createRestaurant, 
  updateRestaurant, 
  countRestaurants, 
}
