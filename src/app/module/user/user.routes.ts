import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import {
  createAdminValidation,
  createPatientValidation,
} from "./user.validation";

const router = Router();

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

export const userRoutes = router;
