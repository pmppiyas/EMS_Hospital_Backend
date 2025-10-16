import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/", ScheduleController.createSchedule);
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  ScheduleController.getSchedules
);

router.delete("/:id", checkAuth(Role.ADMIN), ScheduleController.deleteSchedule);

export const scheduleRoutes = router;
