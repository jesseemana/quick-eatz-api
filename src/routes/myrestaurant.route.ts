import { Router } from 'express';
import MyRestaurantController from '../controllers/myrestaurant.controller';
import { upload, jwtCheck, jwtParse, validateInput, } from '../middleware';

const router = Router();

router.route('/')
  .get([jwtCheck, jwtParse], MyRestaurantController.getMyRestaurant)
  .post(
    [upload.single('imageFile'), validateInput, jwtCheck, jwtParse], 
    MyRestaurantController.createMyRestaurant
  )
  .put( 
    [upload.single('imageFile'), validateInput, jwtCheck, jwtParse], 
    MyRestaurantController.updateMyRestaurant
  );

router.get('/order', [jwtCheck, jwtParse], MyRestaurantController.getMyRestaurantOrders);

router.patch(
  '/order/:orderId/status', 
  [jwtCheck, jwtParse], 
  MyRestaurantController.updateOrderStatus
);

export default router;
