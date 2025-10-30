import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { IJwtPayload } from "../../../types/common";
import { ENV } from "../../config/env";
import prisma from "../../config/prisma";
import { stripe } from "../../config/stripe";
import { AppError } from "../../utils/appError";
import { calculatePagination } from "../../utils/calculatePagination";
import { IOptions, Role } from "../user/user.interface";

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

    return { paymentUrl: session.url };
  });

  return result;
};

const getAppointments = async (
  user: IJwtPayload,
  fillters: any,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { ...filterData } = fillters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role !== Role.ADMIN) {
    if (user.role === Role.PATIENT) {
      andConditions.push({
        patient: {
          email: user.email,
        },
      });
    } else if (user.role === Role.DOCTOR) {
      andConditions.push({
        doctor: {
          email: user.email,
        },
      });
    }
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      user.role === Role.DOCTOR
        ? { patient: true }
        : user.role === Role.PATIENT
        ? { doctor: true }
        : { doctor: true, patient: true },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

const update = async (
  id: string,
  status: AppointmentStatus,
  user: IJwtPayload
) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id },
    include: { doctor: true },
  });

  if (user.role === Role.DOCTOR) {
    if (user.email !== appointment.doctor.email) {
      throw new AppError(StatusCodes.FORBIDDEN, "This is not your appointment");
    }
  }
  return await prisma.appointment.update({
    where: { id },
    data: { status },
  });
};

const cancelUnpaidAppointment = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

  const upPaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAgo,
      },

      paymentStatus: PaymentStatus.UNPAID,
    },
  });

  const appointmentIdsForCancel = upPaidAppointments.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tnx) => {
    await tnx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsForCancel,
        },
      },
    });

    await tnx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsForCancel,
        },
      },
    });

    for (const unPaidAppointment of upPaidAppointments) {
      await tnx.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: unPaidAppointment.doctorId,
            scheduleId: unPaidAppointment.scheduleId,
          },
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentService = {
  create,
  getAppointments,
  update,
  cancelUnpaidAppointment,
};
