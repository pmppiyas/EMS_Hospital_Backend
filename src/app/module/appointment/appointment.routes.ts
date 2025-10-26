import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post("/", checkAuth(Role.PATIENT), AppointmentController.create);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  AppointmentController.getAppointments
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.DOCTOR),
  AppointmentController.updateAppointment
);

export const appointmentRoutes = router;
