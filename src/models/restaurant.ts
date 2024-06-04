import mongoose, { InferSchemaType } from 'mongoose';

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;
export type RestaurantType = InferSchemaType<typeof restaurantSchema>;

const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  deliveryMin: { type: Number, required: true },
  deliveryMax: { type: Number, required: true },
  restaurantName: { type: String, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  thumbNail: { type: String, required: true },
  image: { type: String, required: true },
  lastUpdated: { type: Date, required: true, },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
