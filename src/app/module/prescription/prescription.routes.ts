import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.post(
  "/:id",
  checkAuth(Role.DOCTOR, Role.ADMIN),
  PrescriptionController.create
);

router.get("/", checkAuth(...Object.keys(Role)), PrescriptionController.get);

export const prescriptionRoutes = router;
