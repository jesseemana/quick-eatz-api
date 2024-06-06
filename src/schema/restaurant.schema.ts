import { z } from 'zod';

const MenuItem = z.object({
  name: z.string({
    required_error: 'item name is required'
  }).min(4, 'name must be more than 4 characters'),
  description: z.string({
    required_error: 'item decription is required'
  }).min(4, 'name must be more than 4 characters'),
  price: z.coerce.number({ 
    required_error: 'item price is required' 
  }).min(1, 'price must be more than 4 characters'),
});

export const restaurantSchema = z.object({
  body: z.object({
    restaurantName: z.string({ 
      required_error: 'restaurant name is required' 
    }),
    city: z.string({ 
      required_error: 'city is required' 
    }),
    country: z.string({ 
      required_error: 'country is required' 
    }),
    delivery: z.boolean({
      required_error: 'delivery availability is required'
    }).optional(),
    deliveryPrice: z.coerce.number({  
      invalid_type_error: 'delivery price must be a valid number'
    }).optional(),
    deliveryMin: z.coerce.number({  
      invalid_type_error: 'delivery min must be a valid number'
    }).optional(),
    deliveryMax: z.coerce.number({ 
      invalid_type_error: 'delivery max must be a valid number'
    }).optional(),
    estimatedDeliveryTime: z.coerce.number({ 
      required_error: 'delivery price is required', 
      invalid_type_error: 'must be avlid number', 
    }),
    cuisines: z.array(z.string()),
    menuItems: z.array(MenuItem),
  }),
});

export const searchRestaurant = z.object({
  params: z.object({
    restaurantId: z.string({ 
      required_error: 'restaurant id is required' 
    }).optional(),
    city: z.string({ 
      required_error: 'city is required' 
    }).optional(),
  }),
});

export type SearchType = z.infer<typeof searchRestaurant>['params'];
export type RestaurantType = z.infer<typeof restaurantSchema>['body'];
