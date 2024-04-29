import { Router } from "express";
import MyUserController from "../controllers/user.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = Router();

router.post("/", jwtCheck, MyUserController.registerUser);

router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

router.put("/", jwtCheck, jwtParse, validateMyUserRequest, MyUserController.updateCurrentUser);

export default router;
