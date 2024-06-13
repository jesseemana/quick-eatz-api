import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { log } from '../utils';
import { RestaurantService, ReviewService, UserService } from '../services';
import { CreateReviewType, ReviewType } from '../schema/review.schema';

async function getRestaurantReviews(
  req: Request<ReviewType, {}, {}>, 
  res: Response
) {
  try {
    const { restaurantId } = req.params;

    const restaurant = await RestaurantService.findRestauntById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const [foundReviews, total] = await Promise.all([ 
      ReviewService.getRestaurantReviews(restaurantId), 
      ReviewService.getTotalRestaurantReviews(restaurantId), 
    ]);

    if (!foundReviews || !total) {
      return res.status(200).json({ msg: 'Restaurant has no reviews' });
    }

    const reviews = await Promise.all(foundReviews.map(async (review) => {
      const user = await UserService.findById(review.user.toString());
      if (!user) return res.status(404).json({ msg: 'User not found' });
      return {
        user: user.name,
        review: review.review,
      }
    }));

    res.status(200).json({ reviews, total, });
  } catch (error) {
    log.error(`An error occured, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function postReview(
  req: Request<CreateReviewType['params'], {}, CreateReviewType['body']>, 
  res: Response
) {
  try {
    const { restaurantId } = req.params;
    const user = req.userId;
    const review = req.body;

    const restaurant = await RestaurantService.findRestauntById(restaurantId);
    if (!restaurant) return res.status(400).json({ msg: 'Restaurant not found' });

    const createdReview = await ReviewService.createReview({ 
      ...review,
      user: new mongoose.Types.ObjectId(user), 
      restaurant: new mongoose.Types.ObjectId(restaurantId),  
      createdAt: new Date(),
    });
    if (!createdReview) {
      return res.status(400).send({ msg: 'Failed to create review' });
    }

    res.status(201).json(createdReview);
  } catch (error) {
    log.error(`An error occured, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function editReview(
  req: Request<CreateReviewType['params'], {}, CreateReviewType['body']>, 
  res: Response
) {
  try {
    const { restaurantId, reviewId } = req.params;
    const user = req.userId;
    const review = req.body;

    const [foundReview, restaurant] = await Promise.all([ 
      ReviewService.findReview(reviewId as string), 
      RestaurantService.findRestauntById(restaurantId),  
    ]);

    if (!foundReview || !restaurant) {
      return res.status(400).json({ msg: 'Review or restaurant not found' });
    }

    if (foundReview.user.toString() !== user) 
      return res.status(401).send({ msg: 'Only review owner can update it' });

    const update = await ReviewService.updateReview({ _id: foundReview._id, user }, {
      ...review, 
      createdAt: new Date(), 
    });
    if (!update) return res.status(400).json({ msg: 'Failed to update review' });

    res.status(200).json(update);
  } catch (error) {
    log.error(`An error occured, ${error}`);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

export default { postReview, getRestaurantReviews, editReview, }
