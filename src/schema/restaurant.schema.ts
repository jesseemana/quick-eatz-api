import { z } from 'zod';

const menuItemSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export const restaurantSchema = z.object({
  params: z.object({
    restaurantId: z.string({ 
      required_error: 'Restaurant id is required' 
    }),
    city: z.string({ 
      required_error: 'City is required' 
    })
  }),
  body: z.object({
    restaurantName: z.string({ 
      required_error: 'Restaurant name is required' 
    }),
    city: z.string({ 
      required_error: 'City is required' 
    }),
    country: z.string({ 
      required_error: 'Country is required' 
    }),
    deliveryPrice: z.number({ 
      required_error: 'Delivery price is required' 
    }).min(0, 'Field cannot be less than zero'),
    estimatedDeliveryTime: z.number({ 
      required_error: 'Delivery price is required' 
    }).min(0, 'Field cannot be less than zero'),
    cuisines: z.array(z.string()),
    menuItems: z.array(menuItemSchema),
  })
});

export type RestaurantType = z.infer<typeof restaurantSchema>;
