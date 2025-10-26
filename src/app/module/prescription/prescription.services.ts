import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { Role } from "../user/user.interface";

const create = async (
  user: IJwtPayload,
  appointmentId: string,
  payload: Partial<Prescription>
) => {
  const appointment = await prisma.appointment.findFirstOrThrow({
    where: {
      id: appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },

    include: {
      doctor: true,
    },
  });

  if (user.role === Role.DOCTOR) {
    if (user.email !== appointment?.doctor.email) {
      throw new AppError(StatusCodes.FORBIDDEN, "This is not your appointment");
    }
  }

  const existing = await prisma.prescription.findUnique({
    where: { appointmentId: appointment.id },
  });

  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Prescription already exists for this appointment"
    );
  }

  return await prisma.prescription.create({
    data: {
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: {
        select: {
          name: true,
          contactNumber: true,
          profilePhoto: true,
          address: true,
        },
      },
    },
  });
};

export const PrescriptionService = { create };
