import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { RegisterUserType, UpdateUserType } from '../schema/user.schema';


const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const current_user = req.user;
    if (!current_user) return res.status(404).send('No user found.');
    return res.status(200).send(current_user);
  } catch (error) {
    console.log('An error occured', error);
    return res.status(500).send(`Internal Server Error.`);
  }
};


const registerUser = async (
  req: Request<{}, {}, RegisterUserType>, 
  res: Response
) => {
  try {
    const { auth0Id } = req.body;
    
    const existing_user = await UserService.findUser({ auth0Id });
    if (existing_user) return res.status(200).send();
    
    const new_user = await UserService.createUser(req.body);

    return res.status(201).json(new_user.toObject());
  } catch (error) {
    console.log('An error occured', error);
    return res.status(500).send(`Internal Server Error.`);
  }
};


const updateCurrentUser = async (
  req: Request<{}, {}, UpdateUserType>, 
  res: Response
) => {
  try {
    const body = req.body;

    const user = await UserService.findById(req.userId);
    if (!user) return res.status(404).send('User does not exist');

    const updated = await UserService.updateUser({ _id: req.userId }, { ...body });
    if (updated) return res.status(200).send(updated.toObject());

    return res.status(400).send('Failed to update user.');
  } catch (error) {
    console.log('An error occured', error);
    return res.status(500).send(`Internal Server Error.`);
  }
};


export default {
  getCurrentUser,
  registerUser,
  updateCurrentUser,
};
