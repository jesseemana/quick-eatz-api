import { z } from 'zod';

export const checkoutSessionRequest = z.object({
  cartItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      menuItemId: z.string(),
    })
  ),
  deliveryDetails: z.object({
    name: z.string(),
    city: z.string(),
    email: z.string(),
    addressLine1: z.string(),
  }),
  restaurant_id: z.string(),
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
export type CheckoutSessionRequestType = z.infer<typeof checkoutSessionRequest>;
