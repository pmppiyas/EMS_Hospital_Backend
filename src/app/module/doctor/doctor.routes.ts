import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAll);

router.patch("/:id", DoctorController.update);

export const doctorRoutes = router;
