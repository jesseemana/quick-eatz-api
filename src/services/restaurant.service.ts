import { FilterQuery, UpdateQuery } from 'mongoose';
import Restaurant, { RestaurantType } from '../models/restaurant';

const findById = async (id: string) => {
  const restaurant = await Restaurant.findById(id);
  return restaurant;
}

const search = async ({ query, skip, limit, sortOption }: { 
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

const createRestaurant = async (data: RestaurantType) => {
  const restaurant = await Restaurant.create(data)
  return restaurant;
}

async function countRestaurants(query: any) {
  return await Restaurant.countDocuments(query);
}

const updateRestaurant = async (
  query: FilterQuery<RestaurantType>, 
  update: UpdateQuery<RestaurantType>
) => {
  const updated = await Restaurant.findOneAndUpdate(query, update);
  return updated;
}

export default { 
  search,
  findById, 
  findRestaurant, 
  createRestaurant, 
  updateRestaurant, 
  countRestaurants, 
}
