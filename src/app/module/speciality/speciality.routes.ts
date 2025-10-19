import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialityController } from "./speciality.controller";
import { SpecialitiesValidataion } from "./speciality.validation";

const router = Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  validateRequest(SpecialitiesValidataion.create),
  SpecialityController.create
);

router.get("/", SpecialityController.getAll);

router.delete("/:id", SpecialityController.deleteSpeciality);

export const SpecialityRoutes = router;
