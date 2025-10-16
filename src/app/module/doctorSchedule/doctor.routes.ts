import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { DoctorSchedulesController } from "./doctor.controler";

const router = Router();

router.post(
  "/",
  checkAuth(Role.DOCTOR),
  DoctorSchedulesController.createSchedule
);

export const doctorScheduleRoutes = router;
