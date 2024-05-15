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

export type CheckoutSessionRequestType = z.infer<typeof checkoutSessionRequest>;
