import { Router } from 'express';
import MyUserController from '../controllers/user.controller';
import { jwtCheck, jwtParse, validateInput, } from '../middleware';
import { userSchema } from '../schema/user.schema';

const router = Router();

router.route('/')
  .post(jwtCheck, MyUserController.registerUser)
  .get(
    [jwtCheck, jwtParse, validateInput(userSchema)], 
    MyUserController.getCurrentUser
  )
  .put(
    [jwtCheck, jwtParse, validateInput(userSchema)], 
    MyUserController.updateCurrentUser
  )

export default router;
