import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post("/", checkAuth(Role.PATIENT), AppointmentController.create);

export const appointmentRoutes = router;
