import { PaymentStatus } from "@prisma/client";
import { Stripe } from "stripe";
import prisma from "../../config/prisma";

const stripeWebhookEvent = async (event: any) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        console.warn("⚠️ Missing metadata in Stripe session.");
        return;
      }

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          paymentStatus:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          paymentGatewayData: session as any,
        },
      });

      console.log(`✅ Payment completed for appointment ${appointmentId}`);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return { received: true, eventType: event.type };
};

export const PaymentService = {
  stripeWebhookEvent,
};
