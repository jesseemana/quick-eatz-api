import mongoose, { InferSchemaType } from 'mongoose';

export type FavoriteModelType = InferSchemaType<typeof favoriteSchema>;

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant'
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
