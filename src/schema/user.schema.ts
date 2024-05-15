import { object, z } from 'zod';

export const userSchema = object({
  name: z.string({ 
    required_error: 'name is required' 
  })
    .min(3, 'name must be at least 3 characters long')
    .max(30, 'name cannot be more than 30 characters long')
    .optional(),
  city: z.string({ 
    required_error: 'city is required' 
  }).optional(),
  country: z.string({ 
    required_error: 'country is required' 
  }).optional(),
  addressLine1: z.string({ 
    required_error: 'address line is required' 
  }).optional(),
  email: z.string({ 
    required_error: 'email is required' 
  })
    .email('enter a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  auth0Id: z.string({ 
    required_error: 'auth0Id is required' 
  }).optional(),
});

export type UserType = z.infer<typeof userSchema>;
