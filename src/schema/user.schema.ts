import { z } from 'zod';

export const userSchema = z.object({
  body: z.object({
    auth0Id: z.string().optional(),
    email: z.string().email('enter a valid email')
      .toLowerCase()
      .trim()
      .optional(),
    name: z.string()
      .min(3, 'name cannot be less than 3 characters')
      .max(48, 'name cannot be more than 48 characters long')
      .optional(),
    city: z.string()
      .min(5, 'city cannot be less than 5 characters')
      .max(20, 'city cannot be more than 20 characters long')
      .optional(),
    country: z.string()
      .min(4, 'country cannot be less than 4 characters')
      .max(20, 'country cannot be more than 20 characters long').optional(),
    addressLine1: z.string()
      .min(5, 'addressLine1 cannot be less than 5 characters')
      .max(20, 'addressLine1 cannot be more than 20 characters long')
      .optional(),
  }),
});

export type UserType = z.infer<typeof userSchema>['body'];
