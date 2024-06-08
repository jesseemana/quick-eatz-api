import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Request, Response, } from 'express';
import { MenuItemType } from '../models/restaurant';
import { OrderService, RestaurantService, UserService, }from '../services';
import { CheckoutSessionRequestType } from '../schema/order.schema';
import { log } from '../utils';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

async function getMyOrders(req: Request, res: Response) {
  try {
    const orders = await OrderService.getMyOrders(req.userId);
    if (!orders) {
      return res.status(404).json({ msg: `You currently don't have any orders` });
    }
    res.status(200).json(orders);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function getSingleOrder(req: Request, res: Response) {
  const { orderId } = req.params;
  try {
    const order = await OrderService.findOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

async function createCheckoutSession(
  req: Request<{}, {}, CheckoutSessionRequestType>, 
  res: Response
) {
  try {
    const checkout_request = req.body;
    
    const user = await UserService.findById(req.userId);
    if (!user) return res.status(404).send('User not found!');
    const restaurant = await RestaurantService.findRestauntById(checkout_request.restaurant_id);
    if (!restaurant) return res.status(404).send('Restaurant not found!');

    const newOrder = await OrderService.createOrder({
      restaurant: restaurant._id, 
      user: new mongoose.Types.ObjectId(req.userId), 
      status: 'placed', 
      deliveryDetails: checkout_request.deliveryDetails, 
      cartItems: new mongoose.Types.DocumentArray(checkout_request.cartItems), 
      createdAt: new Date(), 
    });
    
    const lineItems = createLineItems(checkout_request, restaurant.menuItems);

    const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice as number, restaurant._id.toString());
    if (!session) return res.status(500).send('Error creating stripe session');

    // send order confirmation email to user
    
    // only save order in db after it's successfully created in stripe
    await newOrder.save(); 
    res.status(200).json({ url: session.url });
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

function createLineItems(
  checkoutRequest: CheckoutSessionRequestType, 
  menuItems: MenuItemType[]
) {
  const lineItems = checkoutRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === cartItem.menuItemId.toString()
    );
    if (!menuItem) throw new Error(`Menu item not found: ${cartItem.menuItemId}`);

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'mwk',
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        }
      },
      quantity: cartItem.quantity,
    }
    
    return lineItem;
  });

  return lineItems;
}

async function createSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], 
  orderId: string, 
  deliveryPrice: number, 
  restaurantId: string
) {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery',
          type: 'fixed_amount',
          fixed_amount: {
            amount: deliveryPrice,
            currency: 'mwk',
          },
        },
      },      
    ],
    mode: 'payment',
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${process.env.FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/restaurant/${restaurantId}?cancelled=true`,
  });

  return sessionData;
}

const stripeWebhookHandler = async (req: Request, res: Response) => { 
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = STRIPE.webhooks.constructEvent(
      req.body, 
      sig as string, 
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    log.error(`An error occurred, ${error}`);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const order = await OrderService.findOrderById(event.data.object.metadata?.orderId as string);
    if (!order) return res.status(404).send('Order not found');
    order.totalAmount = event.data.object.amount_total;
    await order.save();
  }

  return res.status(200).send();
}

export default { 
  getSingleOrder, 
  createCheckoutSession, 
  getMyOrders, 
  stripeWebhookHandler, 
};
