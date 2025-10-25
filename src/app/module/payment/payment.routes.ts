import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/webhook", PaymentController.stripeWebhookEvent);

export const paymentRoutes = router;
