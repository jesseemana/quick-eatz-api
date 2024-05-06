import { Router } from 'express';
import RestaurantController from '../controllers/restaurant.controller';
import { validateInput } from '../middleware';

const router = Router();

router.get('/:restaurantId', validateInput, RestaurantController.getRestaurant);

router.get('/search/:city', validateInput, RestaurantController.searchRestaurant);

export default router;
