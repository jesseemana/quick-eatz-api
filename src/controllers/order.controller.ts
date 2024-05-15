import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Request, Response, } from 'express';
import { MenuItemType } from '../models/restaurant';
import { OrderService, RestaurantService, }from '../services';
import { CheckoutSessionRequestType } from '../schema/order.schema';


const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_ENDPOINT_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET);


async function getMyOrders(req: Request, res: Response) {
  try {
    const orders = await OrderService.findOrders({ user: req.userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
}


async function createCheckoutSession(
  req: Request<{}, {}, CheckoutSessionRequestType>, 
  res: Response
) {
  try {
    const checkoutRequest = req.body;
    
    const restaurant = await RestaurantService.findById(checkoutRequest.restaurant_id);
    if (!restaurant) return res.status(404).send('Restaurant not found!');

    const new_order = await OrderService.createOrder({
      restaurant: restaurant._id, 
      user: new mongoose.Types.ObjectId(req.userId), 
      status: 'placed', 
      deliveryDetails: checkoutRequest.deliveryDetails, 
      cartItems: new mongoose.Types.DocumentArray(checkoutRequest.cartItems), 
      createdAt: new Date(), 
    });
    
    const lineItems = createLineItems(checkoutRequest, restaurant.menuItems);

    const session = await createSession(
      lineItems, 
      new_order._id.toString(), 
      restaurant.deliveryPrice, 
      restaurant._id.toString()
    );

    if (!session) return res.status(500).send('Error creating stripe session');

    // save order in db after it's successfully created in stripe
    await new_order.save(); 
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
}


function createLineItems(
  checkoutRequest: CheckoutSessionRequestType, 
  menuItems: MenuItemType[]
) {
  const lineItems = checkoutRequest.cartItems.map((cart_item) => {
    const menu_item = menuItems.find((menu_item) => menu_item._id.toString() === cart_item.menuItemId.toString());
    if (!menu_item) throw new Error(`Menu item not found: ${cart_item.menuItemId}`);

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'mwk',
        unit_amount: menu_item.price,
        product_data: {
          name: menu_item.name,
        }
      },
      quantity: cart_item.quantity,
    }
    
    return line_item;
  });

  return lineItems;
}


async function createSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], 
  order_id: string, 
  deliveryPrice: number, 
  restaurant_id: string
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
      order_id,
      restaurant_id,
    },
    success_url: `${process.env.FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/restaurant/${restaurant_id}?cancelled=true`,
  });

  return sessionData;
}


async function stripeWebhookHandler(req: Request, res: Response) { 
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
}


export default {
  createCheckoutSession,
  getMyOrders,
  stripeWebhookHandler,
};
