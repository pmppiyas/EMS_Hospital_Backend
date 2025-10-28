import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.crdLogin);
router.get("/getme", AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
export const authRoutes = router;
