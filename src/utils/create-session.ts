import Stripe from 'Stripe';
import { MenuItemType } from '../models/restaurant';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY);
const FRONTEND_URL = String(process.env.FRONTEND_URL);

export type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    city: string;
    addressLine1: string;
  };
  restaurantId: string;
};

export const createLineItems = async (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {
  const line_items = checkoutSessionRequest.cartItems.map((cart_item) => {
    const menu_item = menuItems.find((item) => item._id.toString() === cart_item.menuItemId.toString());
    if (!menu_item) throw new Error(`Menu item not found: ${cart_item.menuItemId}`);

    const line_item: Stripe.Checkout.CreateSessionParams.LineItem = {
      price_data: {
        currency: 'gbp',
        unit_amount: menu_item.price,
        product_data: {
          name: menu_item.name
        },
      },
      quantity: parseInt(cart_item.quantity),
    }

    return line_item;
  })

  return line_items;
}

export const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], 
  orderId: string, 
  restaurantId: string,
  deliveryPrice: number, 
) => {
  const session_data = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery',
          type: 'fixed_amount',
          fixed_amount: {
            amount: deliveryPrice,
            currency: 'gbp',
          },
        },
      },
    ],
    mode: 'payment',
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return session_data;
}
