import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.crdLogin);
router.get("/getme", AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  checkAuth(...Object.keys(Role)),
  AuthController.changePassword
);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);

export const authRoutes = router;
