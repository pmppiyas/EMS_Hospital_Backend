import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Stripe } from "stripe";
import { ENV } from "../../config/env";
import { stripe } from "../../config/stripe";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.services";

const stripeWebhookEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    //Verify Signature
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        ENV.STRIPE.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    const result = await PaymentService.stripeWebhookEvent(event);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Webhook received successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  stripeWebhookEvent,
};
