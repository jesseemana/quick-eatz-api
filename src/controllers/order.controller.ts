import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import { OrderService }from "../services";
import { CheckoutSessionRequest, createLineItems, createSession } from "../utils/create-session";


const STRIPE = new Stripe(String(process.env.STRIPE_API_KEY));
const STRIPE_ENDPOINT_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET);


const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.findOrders({ user: req.userId })
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};


const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
    if (!restaurant) return res.status(404).send("Restaurant not found.");

    const new_order = await OrderService.createOrder(checkoutSessionRequest);

    const line_items = await createLineItems(checkoutSessionRequest, restaurant.menuItems);

    const session = await createSession(
      line_items,
      new_order._id.toString(),
      restaurant._id.toString(),
      restaurant.deliveryPrice,
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session." });
    }

    await new_order.save();

    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};


const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(req.body, String(sig), STRIPE_ENDPOINT_SECRET);
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await OrderService.findOrderById(event.data.object.metadata?.orderId);

    if (!order) return res.status(404).json({ message: "Order not found." });

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200);
};


export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
};
