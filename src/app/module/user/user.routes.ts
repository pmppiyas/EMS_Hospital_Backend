import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import {
  createAdminValidation,
  createDoctorValidation,
  createPatientValidation,
  userStatusChangeValidation,
} from "./user.validation";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUser);

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

router.patch(
  "/:id/:status",
  validateRequest(userStatusChangeValidation),
  UserController.changeUserStatus
);

export const userRoutes = router;
