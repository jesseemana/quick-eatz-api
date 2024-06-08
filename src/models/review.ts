import mongoose, { InferSchemaType } from 'mongoose';

export type ReviewType = InferSchemaType<typeof reviewSchema>;

const reviewSchema = new mongoose.Schema({
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
  review: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
