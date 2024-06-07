import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { log, uploadImage, uploadThumb } from '../utils';
import { OrderStatusType } from '../schema/order.schema';
import { RestaurantType } from '../schema/restaurant.schema';
import { OrderService, RestaurantService } from '../services';

async function getMyRestaurant(req: Request, res: Response) {
  try {
    const restaurant = await RestaurantService.findRestaurant(req.userId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found.' }); 
    res.status(200).json(restaurant);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

async function createMyRestaurant(
  req: Request<{}, {}, RestaurantType>, 
  res: Response
) {
  try {
    // @ts-ignore
    const [image, thumbNail] = Object.values(req.files).map(files => files[0])

    const existingRestaurant = await RestaurantService.findRestaurant(req.userId);
    if (existingRestaurant) 
      return res.status(409).json({ msg: 'User restaurant already exists.' });

    const [imageResponse, thumbNailResponse] = await Promise.all([
      uploadImage(image),
      uploadThumb(thumbNail),
    ]);

    if (!imageResponse || !thumbNailResponse) 
      return res.status(400).json({ msg: 'Failed to upload image' });

    const restaurant = await RestaurantService.createRestaurant({ 
      ...req.body,
      user: new mongoose.Types.ObjectId(req.userId), 
      menuItems: new mongoose.Types.DocumentArray(req.body.menuItems),
      image: imageResponse.image,
      thumbNail: thumbNailResponse.image,
      lastUpdated: new Date(),
    });

    res.status(201).json(restaurant);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};


async function updateMyRestaurant(
  req: Request<{}, {}, RestaurantType>, 
  res: Response
) {
  try {
    // @ts-ignore
    const [image, thumbNail] = Object.values(req.files).map(files => files[0])

    const [imageResponse, thumbNailResponse] = await Promise.all([
      uploadImage(image),
      uploadThumb(thumbNail),
    ]);

    if (!imageResponse || !thumbNailResponse) 
      return res.status(400).json({ msg: 'Failed to upload image' });

    const updated = await RestaurantService.updateRestaurant({ user: req.userId }, { 
      ...req.body, 
      menuItems: new mongoose.Types.DocumentArray(req.body.menuItems),
      image: imageResponse.image, 
      thumbNail: thumbNailResponse.image,
      lastUpdated: new Date(), 
    });

    res.status(200).json(updated);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};


async function getMyRestaurantOrders(req: Request, res: Response) {
  try {
    const restaurant = await RestaurantService.findRestaurant(req.userId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found.' });

    const orders = await OrderService.findRestaurantOrders(restaurant._id.toString());
    if (!orders) {
      return res.status(404).json({ msg: `You currently don't have any orders.` });
    }

    res.status(200).json(orders);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};


async function updateOrderStatus(
  req: Request<OrderStatusType['params'], {}, OrderStatusType['body']>, 
  res: Response
) {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await OrderService.findOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found.' });

    const restaurant = await RestaurantService.findRestauntById(String(order.restaurant));
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).json({ msg: `User can't update order status.` });
    }

    order.status = status;
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    log.error(`An error occurred, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};


export default {
  getMyRestaurantOrders,
  updateOrderStatus,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
