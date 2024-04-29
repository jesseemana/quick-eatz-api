import Order from '../models/order';

const createOrder = async (data: any) => {
  const new_order = new Order(data)
  return new_order;
}

const findOrders = async ({ user }: { user: string }) => {
  const order = await Order.find({ user }).populate('restaurant').populate('user');
  return order;
}

const findRestaurantOrders = async ({ restaurant }: { restaurant: string }) => {
  const order = await Order.find({ restaurant }).populate('restaurant').populate('user');
  return order;
}

const findOrderById = async (id: string) => {
  const order = await Order.findById(id);
  return order;
}

export default { createOrder, findOrders, findOrderById, findRestaurantOrders, }
