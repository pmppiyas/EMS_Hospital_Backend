import { PaymentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { Role } from "../user/user.interface";

const fetchDashboardMetaData = async (user: IJwtPayload) => {
  let metadata;

  switch (user.role) {
    case Role.ADMIN:
      metadata = null;
      break;
    case Role.DOCTOR:
      metadata = await doctorMetadata(user);
      break;
    case Role.PATIENT:
      metadata = await patientMetadata(user);
      break;

    default:
      throw new AppError(StatusCodes.FORBIDDEN, "Invalid User!");
  }
  return metadata;
};

const patientMetadata = async (user: IJwtPayload) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patient.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patient.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patient.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patient.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    appointmentCountByStatus: formattedAppointmentStatusDistribution,
    prescriptionCount,
    reviewCount,
  };
};

const doctorMetadata = async (user: IJwtPayload) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctor.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctor.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },

    where: {
      appointment: {
        doctorId: doctor.id,
      },

      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctor.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    patientCount,
    reviewCount,
    totalRevenue,
    appointmentCountByStatus: formattedAppointmentStatusDistribution,
  };
};

export const MetaServices = {
  fetchDashboardMetaData,
};
