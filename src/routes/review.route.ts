import { Router } from 'express';
import { jwtCheck, jwtParse, validateInput } from '../middleware';
import ReviewController from '../controllers/review.controller';
import { createdReviewschema, reviewchema } from '../schema/review.schema';

const router = Router();

router.route('/:restaurantId')
  .get([jwtCheck, jwtParse, validateInput(reviewchema)], ReviewController.getRestaurantReviews)
  .post([jwtCheck, jwtParse, validateInput(createdReviewschema)], ReviewController.postReview);

router.put(
  '/:restaurantId/edit/:reviewId', 
  [jwtCheck, jwtParse, validateInput(createdReviewschema)], 
  ReviewController.editReview
);

export default router;
