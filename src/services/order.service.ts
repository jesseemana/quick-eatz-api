import Order, { OrderType } from '../models/order';

const createOrder = async (data: OrderType) => {
  const new_order = new Order(data);
  return new_order;
}

const getMyOrders = async (user_id: string) => {
  const orders = await Order.find({ user: user_id })
    .populate('restaurant')
    .populate('user');
  return orders;
}

const findRestaurantOrders = async (restaurant_id: string) => {
  const orders = await Order.find({ restaurant: restaurant_id })
    .populate('restaurant')
    .populate('user');
  return orders;
}

const findOrderById = async (id: string) => {
  const order = await Order.findById(id);
  return order;
}

export default { 
  findOrderById, 
  createOrder, 
  getMyOrders, 
  findRestaurantOrders, 
}
