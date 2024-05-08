import Stripe from 'stripe';
import { MenuItemType } from '../models/restaurant';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
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


export const createLineItems = async (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {}


export const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], 
  orderId: string, 
  restaurantId: string,
  deliveryPrice: number, 
) => {}
