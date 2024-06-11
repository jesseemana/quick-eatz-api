import { z } from 'zod';

export const createdReviewschema = z.object({
  body: z.object({
    review: z.string({
      required_error: 'provide your review'
    })
    .min(4, 'Review can not be less than 4 characters')
    .trim()
  }),
  params: z.object({
    restaurantId: z.string({ 
      required_error: 'restaurant id is required' 
    }),
    reviewId: z.string({ 
      required_error: 'review id is required' 
    }).optional()
  }),
});

export const reviewchema = z.object({
  params: z.object({
    restaurantId: z.string({ 
      required_error: 'restaurant id is required' 
    }),
  }),
});

export type CreateReviewType = z.infer<typeof createdReviewschema>;
export type ReviewType = z.infer<typeof reviewchema>['params'];
