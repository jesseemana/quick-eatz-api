import Stripe from 'stripe';
import { Request, Response } from 'express';
import { OrderService }from '../services';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_ENDPOINT_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET);

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.findOrders({ user: req.userId })
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const createCheckoutSession = async (req: Request, res: Response) => {};

const stripeWebhookHandler = async (req: Request, res: Response) => {};

export default {
  createCheckoutSession,
  getMyOrders,
  stripeWebhookHandler,
};
