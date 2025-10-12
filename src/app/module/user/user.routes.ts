import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import {
  createAdminValidation,
  createDoctorValidation,
  createPatientValidation,
} from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUser);

router.post(
  "/create_patient",
  fileUploader.upload.single("file"),
  validateRequest(createPatientValidation),
  UserController.create_patient
);

router.post(
  "/create_admin",
  fileUploader.upload.single("file"),
  validateRequest(createAdminValidation),
  UserController.createAdmin
);

router.post(
  "/create_doctor",
  fileUploader.upload.single("file"),
  validateRequest(createDoctorValidation),
  UserController.createDoctor
);

export const userRoutes = router;
