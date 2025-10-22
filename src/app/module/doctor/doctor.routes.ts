import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAll);

router.patch("/:id", DoctorController.update);

// suggestion route
router.post("/suggestion", DoctorController.suggestion);
export const doctorRoutes = router;
