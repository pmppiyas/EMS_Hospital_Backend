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
      metadata = null;
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

export const MetaServices = {
  fetchDashboardMetaData,
};
