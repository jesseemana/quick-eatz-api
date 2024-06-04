import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { log, uploadImage } from '../utils';
import { OrderStatusType } from '../schema/order.schema';
import { RestaurantType } from '../schema/restaurant.schema';
import { OrderService, RestaurantService } from '../services';


async function getMyRestaurant(req: Request, res: Response) {
  try {
    const restaurant = await RestaurantService.findRestaurant(req.userId);
    if (!restaurant) return res.status(404).send('Restaurant not found.'); 
    return res.status(200).json(restaurant);
  } catch (error) {
    log.error('An error occured', error);
    return res.status(500).send('Internal Server Error');
  }
};


async function createMyRestaurant(
  req: Request<{}, {}, RestaurantType>, 
  res: Response
) {
  try {
    const body = req.body;
    // @ts-ignore
    const [image, thumbNail] = Object.values(req.files).map(files => files[0])

    const existingRestaurant = await RestaurantService.findRestaurant(req.userId);
    if (existingRestaurant) 
      return res.status(409).send('User restaurant already exists.');

    const [imageResponse, thumbNailResponse] = await Promise.all([
      uploadImage(image),
      uploadImage(thumbNail),
    ]);

    if (!imageResponse || !thumbNailResponse) 
      return res.status(400).send('Failed to upload image');

    const restaurant = await RestaurantService.createRestaurant({ 
      ...body,
      user: new mongoose.Types.ObjectId(req.userId), 
      menuItems: new mongoose.Types.DocumentArray(body.menuItems),
      image: imageResponse.image,
      thumbNail: thumbNailResponse.image,
      lastUpdated: new Date(),
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    log.error('An error occured', error);
    return res.status(500).send('Internal Server Error');
  }
};


async function updateMyRestaurant(
  req: Request<{}, {}, RestaurantType>, 
  res: Response
) {
  try {
    const updateData = req.body;
    // @ts-ignore
    const [image, thumbNail] = Object.values(req.files).map(files => files[0])

    const [imageResponse, thumbNailResponse] = await Promise.all([
      uploadImage(image),
      uploadImage(thumbNail),
    ]);

    if (!imageResponse || !thumbNailResponse) 
      return res.status(400).send('Failed to upload image');

    const updated = await RestaurantService.updateRestaurant({ user: req.userId }, { 
      ...updateData, 
      image: imageResponse.image, 
      thumbNail: thumbNailResponse.image,
      lastUpdated: new Date(), 
    });

    return res.status(200).json(updated);
  } catch (error) {
    log.error('An error occured', error);
    return res.status(500).send('Internal Server Error');
  }
};


async function getMyRestaurantOrders(req: Request, res: Response) {
  try {
    const restaurant = await RestaurantService.findRestaurant(req.userId);
    if (!restaurant) return res.status(404).send('Restaurant not found.');

    const orders = await OrderService.findRestaurantOrders(restaurant._id.toString());
    if (!orders) {
      return res.status(404).send(`You currently don't have any orders.`);
    }

    return res.status(200).json(orders);
  } catch (error) {
    log.error('An error occured', error);
    return res.status(500).send('Internal Server Error');
  }
};


async function updateOrderStatus(
  req: Request<OrderStatusType['params'], {}, OrderStatusType['body']>, 
  res: Response
) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderService.findOrderById(orderId);
    if (!order) return res.status(404).send('Order not found.');

    const restaurant = await RestaurantService.findById(String(order.restaurant));
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send(`User can't update order status.`);
    }

    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    log.error('An error occured', error);
    return res.status(500).send('Internal Server Error');
  }
};


export default {
  getMyRestaurantOrders,
  updateOrderStatus,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
