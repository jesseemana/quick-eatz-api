import { object, z } from 'zod';

export const registerUserSchema = object({
  email: z.string({ 
    required_error: 'email is required' 
  }).toLowerCase().trim(),
  auth0Id: z.string({ 
    required_error: 'auth0Id is required' 
  }),
});

export const updateUserSchema = object({
  name: z.string({ required_error: 'Name is required' })
    .min(3, 'Name must be at least 3 characters long')
    .max(30, 'Name cannot be more than 30 characters long'),
  city: z.string({ required_error: 'City is required' }),
  country: z.string({ required_error: 'Country is required' }),
  addressLine1: z.string({ 
    required_error: 'Address line is required' 
  }),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type RegisterUserType = z.infer<typeof registerUserSchema>;
