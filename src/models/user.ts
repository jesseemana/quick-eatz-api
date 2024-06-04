import mongoose, { InferSchemaType } from 'mongoose';

export type UserType = InferSchemaType<typeof userSchema>;

const { Schema } = mongoose;

const userSchema = new Schema({
  auth0Id: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
  },
  name: { type: String, },
  phone: { type: String, },
  city: { type: String, },
  country: { type: String, },
  addressLine1: { type: String, },
});

const User = mongoose.model('User', userSchema);

export default User;
