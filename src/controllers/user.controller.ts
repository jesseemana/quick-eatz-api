import { Request, Response } from 'express';
import { UserType } from '../schema/user.schema';
import UserService from '../services/user.service';


async function getCurrentUser(req: Request, res: Response) {
  try {
    const current_user = req.user;
    if (!current_user) return res.status(404).send('No user found.');
    return res.status(200).json(current_user);
  } catch (error) {
    console.log('An error occurred:', error);
    return res.status(500).send(`Internal Server Error`);
  }
};


async function registerUser(
  req: Request<{}, {}, UserType>, 
  res: Response
) {
  try {
    const { auth0Id, email } = req.body;
    
    const existing_user = await UserService.findUser({ auth0Id });
    if (existing_user) return res.status(200).send();
    
    const new_user = await UserService.createUser({ auth0Id, email, });

    return res.status(201).json(new_user.toObject());
  } catch (error) {
    console.log('An error occurred:', error);
    return res.status(500).send(`Internal Server Error`);
  }
};


async function updateCurrentUser(
  req: Request<{}, {}, UserType>, 
  res: Response
) {
  try {
    const { name, city, addressLine1, country } = req.body;

    // TODO: try leaving userId as mongoose objectId in middleware if fails here
    const user = await UserService.findById(req.userId); 
    if (!user) return res.status(404).send('User does not exist');

    const updated = await UserService.updateUser({ _id: req.userId }, { name, city, addressLine1, country });
    if (updated) return res.status(200).json(updated.toObject());

    return res.status(400).send('Failed to update user');
  } catch (error) {
    console.log('An error occurred:', error);
    return res.status(500).send(`Internal Server Error`);
  }
};


export default {
  getCurrentUser,
  registerUser,
  updateCurrentUser,
};
