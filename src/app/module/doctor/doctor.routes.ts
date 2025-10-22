import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAll);

router.patch("/:id", DoctorController.update);

// suggestion route
router.post("/suggestion", DoctorController.suggestion);

router.get("/:id", DoctorController.getById);

export const doctorRoutes = router;
