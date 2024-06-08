import mongoose, { InferSchemaType } from 'mongoose';

export type FavoriteModelType = InferSchemaType<typeof favoriteSchema>;

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant',
    required: true,
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
