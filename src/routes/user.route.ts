import { Router } from 'express';
import MyUserController from '../controllers/user.controller';
import { jwtCheck, jwtParse, validateInput, } from '../middleware';
import { userSchema } from '../schema/user.schema';

const router = Router();

router.route('/')
  .get(
    [jwtCheck, jwtParse, validateInput(userSchema)], 
    MyUserController.getCurrentUser
  )
  .put(
    [jwtCheck, jwtParse, validateInput(userSchema)], 
    MyUserController.updateCurrentUser
  )
  .post(jwtCheck, MyUserController.registerUser);

export default router;
