import { Router } from 'express';
import { validateInput } from '../middleware';
import { searchRestaurant } from '../schema/restaurant.schema';
import RestaurantController from '../controllers/restaurant.controller';

const router = Router();

router.get(
  '/:restaurantId', 
  validateInput(searchRestaurant), 
  RestaurantController.getRestaurant
);

router.get(
  '/search/:city', 
  validateInput(searchRestaurant), 
  RestaurantController.searchRestaurant
);

export default router;
