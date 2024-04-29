import { Request, Response } from "express";
import UserService from "../services/user.service";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const current_user = await UserService.findById(req.userId);
    if (!current_user) return res.status(404).json({ message: "User not found." });

    res.json(current_user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existing_user = await UserService.findUser({ auth0Id });
    if (existing_user) return res.status(200).send();

    const new_user = await UserService.createUser(req.body);

    res.status(201).json(new_user.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const updated = await UserService.updateUser({ _id: req.userId }, { name, addressLine1, country, city });
    if (updated) return res.status(200).send(updated.toObject());

    res.status(400).send("Failed to update user.");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export default {
  getCurrentUser,
  registerUser,
  updateCurrentUser,
};
