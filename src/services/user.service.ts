import { FilterQuery, UpdateQuery } from 'mongoose';
import User, { UserType } from '../models/user';

const findById = async (id: string) => {
  const user = await User.findById(id);
  return user;
}

const findUser = async ({ auth0Id }: { auth0Id?: string }) => {
  const user = await User.findOne({ auth0Id: auth0Id });
  return user;
}

const createUser = async (data: Partial<UserType>) => {
  const user = await User.create(data);
  return user;
}

const updateUser = async (
  filter: FilterQuery<UserType>, 
  update: UpdateQuery<UserType>
) => {
  const updated = await User.findByIdAndUpdate(filter, update);
  return updated;
}

export default { findById, findUser, createUser, updateUser, }
