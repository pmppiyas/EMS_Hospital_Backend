import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { PatientController } from "./patient.controller";
const router = Router();

router.get("/", checkAuth(Role.ADMIN), PatientController.get);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.DOCTOR),
  PatientController.getById
);

export const patientRoutes = router;
