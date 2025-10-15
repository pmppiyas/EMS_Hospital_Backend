import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post("/create", ScheduleController.createSchedule);

export const scheduleRoutes = router;
