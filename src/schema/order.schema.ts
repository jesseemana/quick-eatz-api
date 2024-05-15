import { z } from 'zod';

export const checkoutData = z.object({
  body: z.object({
    cartItems: z.array(
      z.object({
        name: z.string({
          required_error: 'item name is required'
        }),
        quantity: z.coerce.number({
          required_error: 'item quantity is required'
        }),
        menuItemId: z.string({
          required_error: 'menu item is is required'
        }),
      })
    ),
    deliveryDetails: z.object({
      name: z.string({
        required_error: 'name is required'
      }),
      city: z.string({
        required_error: 'city is required'
      }),
      email: z.string({
        required_error: 'email is required'
      }).email('provide a valid email'),
      addressLine1: z.string({
        required_error: 'delivery address is required'
      }),
    }),
    restaurant_id: z.string({
      required_error: 'restaurant id is required'
    }),
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
export type CheckoutSessionRequestType = z.infer<typeof checkoutData>['body'];
