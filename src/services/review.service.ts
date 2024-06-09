import { FilterQuery, UpdateQuery } from 'mongoose';
import Review, { ReviewType } from '../models/review';

async function createReview(data: ReviewType) {
  const review = await Review.create(data);
  return review;
}

async function findReview(id: string) {
  const review = await Review.findById(id);
  return review;
}

async function updateReview(
  filter: FilterQuery<ReviewType>, 
  data: UpdateQuery<ReviewType>
) {
  const updated = await Review.findOneAndUpdate(filter, data);
  return updated;
}

async function getReviews(restaurant: string) {
  const reviews = await Review.find({ restaurant });
  return reviews;
}

export default { createReview, updateReview, findReview, getReviews, }