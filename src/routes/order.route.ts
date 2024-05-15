import { Router } from 'express';
import { jwtCheck, jwtParse, validateInput } from '../middleware';
import OrderController from '../controllers/order.controller';
import { checkoutData } from '../schema/order.schema';

const router = Router();

router.get('/', [jwtCheck, jwtParse], OrderController.getMyOrders);

router.post(
  '/checkout/create-checkout-session', 
  [jwtCheck, jwtParse, validateInput(checkoutData)],
  OrderController.createCheckoutSession
);

router.post('/checkout/webhook', OrderController.stripeWebhookHandler);

export default router;
