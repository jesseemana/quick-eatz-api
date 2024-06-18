import { Request, Response } from 'express';
import { log } from '../utils';
import { UserType } from '../schema/user.schema';
import UserService from '../services/user.service';

async function getCurrentUser(req: Request, res: Response) {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(404).send('No user found.');
    res.status(200).json(currentUser);
  } catch (error) {
    log.error(`An error occurred. ${error}`);
    return res.status(500).send(`Internal Server Error`);
  }
};

async function registerUser(
  req: Request<{}, {}, UserType>, 
  res: Response
) {
  try {
    const { auth0Id, email } = req.body;
    const existingUser = await UserService.findUser({ auth0Id });
    if (existingUser) return res.status(204).send();
    const newUser = await UserService.createUser({ auth0Id, email, });
    res.status(201).json(newUser.toObject());
  } catch (error) {
    log.error(`An error occurred. ${error}`);
    return res.status(500).send(`Internal Server Error`);
  }
};

async function updateCurrentUser(
  req: Request<{}, {}, UserType>, 
  res: Response
) {
  try {
    const { name, city, phone, addressLine1, country } = req.body;

    const user = await UserService.findById(req.userId); 
    if (!user) return res.status(404).send('User does not exist');

    const updated = await UserService.updateUser({ _id: req.userId }, { name, city, phone, addressLine1, country });
    if (updated) return res.status(200).json(updated.toObject());

    res.status(400).send('Failed to update user');
  } catch (error) {
    log.error(`An error occurred. ${error}`);
    return res.status(500).send(`Internal Server Error`);
  }
};

export default { getCurrentUser, registerUser, updateCurrentUser, };
