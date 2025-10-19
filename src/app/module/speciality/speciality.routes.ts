import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { SpecialityController } from "./speciality.controller";

const router = Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  SpecialityController.create
);

export const SpecialityRoutes = router;
