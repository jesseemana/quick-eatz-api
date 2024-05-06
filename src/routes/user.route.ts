import { Router } from 'express';
import MyUserController from '../controllers/user.controller';
import { jwtCheck, jwtParse, validateInput, } from '../middleware';

const router = Router();

router.route('/')
  .get([jwtCheck, jwtParse], MyUserController.getCurrentUser)
  .post(jwtCheck, MyUserController.registerUser)
  .put([jwtCheck, jwtParse, validateInput], MyUserController.updateCurrentUser);

export default router;
