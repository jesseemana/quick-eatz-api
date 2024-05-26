import { z } from 'zod';

export const favoriteSchema = z.object({
  params: z.object({
    restaurantId: z.string({
      required_error: 'provide a restaurant id'
    })
  })
});

export type FavoriteType = z.infer<typeof favoriteSchema>['params'];
