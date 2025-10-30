import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { MetaController } from "./meta.controller";

const router = Router();

router.get(
  "/",
  checkAuth(...Object.keys(Role)),
  MetaController.fetchDashboardMetaData
);

export const metaRoutes = router;
