import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create_patient", UserController.create_patient);

export const userRoutes = router;
