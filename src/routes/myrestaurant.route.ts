import { Router } from "express";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";
import MyRestaurantController from "../controllers/myrestaurant.controller";

const router = Router();

const { getMyRestaurant, getMyRestaurantOrders, updateMyRestaurant, createMyRestaurant, updateOrderStatus } = MyRestaurantController;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

router.get("/", [jwtCheck, jwtParse], getMyRestaurant);

router.get("/order", [jwtCheck, jwtParse], getMyRestaurantOrders);

router.patch("/order/:orderId/status", [jwtCheck, jwtParse], updateOrderStatus);

router.put("/", [upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse], updateMyRestaurant);

router.post("/", [upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse], createMyRestaurant);

export default router;
