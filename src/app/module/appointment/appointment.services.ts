import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { IJwtPayload } from "../../../types/common";
import { ENV } from "../../config/env";
import prisma from "../../config/prisma";
import { stripe } from "../../config/stripe";
import { AppError } from "../../utils/appError";

const create = async (
  user: IJwtPayload,
  payload: {
    doctorId: string;
    scheduleId: string;
  }
) => {
  const patient = await prisma.patient.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const schedule = await prisma.schedule.findFirstOrThrow({
    where: {
      id: payload.scheduleId,
    },
  });
  const isBooked = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctor.id,
      scheduleId: schedule.id,
    },
  });

  if (isBooked.isBooked) {
    throw new AppError(StatusCodes.CONFLICT, "This schedule is already booked");
  }

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const createAppointment = await tnx.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        scheduleId: schedule.id,
        videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctor.id,
          scheduleId: schedule.id,
        },
      },

      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();

    const payment = await tnx.payment.create({
      data: {
        appointmentId: createAppointment.id,
        transactionId,
        amount: doctor.appointmentFee,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment with Dr." + doctor.name,
            },
            unit_amount: Math.round((doctor.appointmentFee * 100) / 122.3),
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: createAppointment.id,
        paymentId: payment.id,
      },
      success_url: ENV.STRIPE.SUCCESS_URL,
      cancel_url: ENV.STRIPE.CANCEL_URL,
    });

    return { payemntUrl: session.url };
  });

  return result;
};

export const AppointmentService = {
  create,
};
