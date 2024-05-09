import { z } from 'zod';

export const restaurantSchema = z.object({
  params: z.object({
    restaurantId: z.string({ 
      required_error: 'Restaurant id is required' 
    }),
    city: z.string({ 
      required_error: 'City is required' 
    }),
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
    deliveryPrice: z.coerce.number({ 
      required_error: 'Delivery price is required', 
      invalid_type_error: 'must be a valid number'
    }),
    estimatedDeliveryTime: z.coerce.number({ 
      required_error: 'Delivery price is required', 
      invalid_type_error: 'must be avlid number', 
    }),
    cuisines: z.array(z.string()),
    menuItems: z.array(
      z.object({
        name: z.string().min(4, 'Name is required'),
        price: z.number().min(1, 'Price is required'),
      })
    ),
  }),
});

export const orderStatusSchema = z.object({
  params: z.object({
    orderId: z.string()
  }),
  body: z.object({
    status: z.enum(['placed', 'paid', 'inProgress', 'outForDelivery', 'delivered'])
  })
})

export type OrderStatusType = z.infer<typeof orderStatusSchema>;
export type RestaurantType = z.infer<typeof restaurantSchema>;
