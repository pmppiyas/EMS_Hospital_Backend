import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/:id", checkAuth(Role.PATIENT), ReviewController.create);

router.get("/", checkAuth(Role.DOCTOR, Role.ADMIN), ReviewController.get);

export const reviewRoutes = router;
