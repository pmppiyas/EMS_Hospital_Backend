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
      metadata = await adminMetadata();
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

const adminMetadata = async () => {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },

    where: {
      status: PaymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    patientCount,
    doctorCount,
    adminCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};

const getBarChartData = async () => {
  const appointmentCountPerMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;

  return appointmentCountPerMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const formatedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return formatedAppointmentStatusDistribution;
};

export const MetaServices = {
  fetchDashboardMetaData,
};
