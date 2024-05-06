import { Request, Response } from 'express';
import mongoose from 'mongoose';
import uploadImage from '../utils/upload';
import { OrderService, RestaurantService } from '../services';
import { RestaurantType } from '../schema/restaurant.schema';


const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await RestaurantService.findRestaurant({ user_id: req.userId });
    if (!restaurant) { return res.status(404).json({ message: 'restaurant not found.' }); }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.log('An error occured', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


const createMyRestaurant = async (
  req: Request, 
  res: Response
) => {
  try {
    const body = req.body;
    
    const existing_restaurant = await RestaurantService.findRestaurant({ user_id: req.userId });
    if (existing_restaurant) {
      return res.status(409).json({ message: 'User restaurant already exists.' });
    }

    const image_url = await uploadImage(req.file as Express.Multer.File);

    const restaurant = await RestaurantService.createRestaurant({ 
      ...body,
      user: new mongoose.Types.ObjectId(req.userId), 
      imageUrl: image_url,
      lastUpdated: new Date(),
    });

    return res.status(201).send(restaurant);
  } catch (error) {
    console.log('An error occured', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


const updateMyRestaurant = async (
  req: Request<{}, {}, RestaurantType['body']>, 
  res: Response
) => {
  try {
    const update_data = req.body;

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const updated = await RestaurantService.updateRestaurant({ user: req.userId }, { 
      ...update_data, 
      imageUrl: imageUrl, 
      lastUpdated: new Date(), 
    });

    return res.status(200).send(updated);
  } catch (error) {
    console.log('An error occured', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await RestaurantService.findRestaurant({ user_id: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'restaurant not found.' });
    }

    const orders = await OrderService.findRestaurantOrders({ restaurant: String(restaurant._id) });
    if (!orders) return res.status(404).send(`You currently don't have any orders.`);

    return res.status(200).json(orders);
  } catch (error) {
    console.log('An error occured', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};


const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderService.findOrderById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const restaurant = await RestaurantService.findById(String(order.restaurant));
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401);
    }

    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.log('An error occured', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};


export default {
  updateOrderStatus,
  getMyRestaurantOrders,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
