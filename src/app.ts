import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import cron from "node-cron";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { AppointmentService } from "./app/module/appointment/appointment.services";
import { PaymentController } from "./app/module/payment/payment.controller";
import router from "./app/routes/routes";

const app = express();

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhookEvent
);

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointment();
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/v1", router);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(globalErrorHandler);

export default app;
