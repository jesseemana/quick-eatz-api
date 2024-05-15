import { Router } from 'express';
import { validateInput } from '../middleware';
import { restaurantSchema } from '../schema/restaurant.schema';
import RestaurantController from '../controllers/restaurant.controller';

const router = Router();

router.get(
  '/:restaurantId', 
  validateInput(restaurantSchema), 
  RestaurantController.getRestaurant
);

router.get(
  '/search/:city', 
  validateInput(restaurantSchema), 
  RestaurantController.searchRestaurant
);

export default router;
