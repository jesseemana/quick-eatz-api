import { Router } from 'express';
import MyRestaurantController from '../controllers/myrestaurant.controller';
import { upload, jwtCheck, jwtParse, validateInput, } from '../middleware';
import { restaurantSchema } from '../schema/restaurant.schema';
import { orderStatusSchema } from '../schema/order.schema';

const router = Router();

router.route('/')
  .get([jwtCheck, jwtParse], MyRestaurantController.getMyRestaurant)
  .post(
    jwtCheck, jwtParse, [upload.single('image'), validateInput(restaurantSchema)], 
    MyRestaurantController.createMyRestaurant
  )
  .put( 
    [jwtCheck, jwtParse, upload.single('image'), validateInput(restaurantSchema)], 
    MyRestaurantController.updateMyRestaurant
  );

router.get(
  '/orders', 
  [jwtCheck, jwtParse],
  MyRestaurantController.getMyRestaurantOrders
);

router.patch(
  '/order/:orderId/status', 
  [jwtCheck, jwtParse, validateInput(orderStatusSchema)], 
  MyRestaurantController.updateOrderStatus
);

export default router;
