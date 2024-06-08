import { Router } from 'express';
import { validateInput } from '../middleware';
import { searchSchema } from '../schema/restaurant.schema';
import RestaurantController from '../controllers/restaurant.controller';

const router = Router();

router.get(
  '/:restaurantId', 
  validateInput(searchSchema), 
  RestaurantController.getRestaurant
);

router.get(
  '/search/:city', 
  validateInput(searchSchema), 
  RestaurantController.searchRestaurant
);

export default router;
