import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const create = async (
  user: IJwtPayload,
  appointmentId: string,
  payload: {
    rating: string;
    comment: string;
  }
) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
  });

  if (patient.id !== appointment.patientId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This is not your appointment "
    );
  }
  const reviewExist = await prisma.review.findUnique({
    where: {
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientId: patient.id,
    },
  });

  if (reviewExist) {
    throw new AppError(StatusCodes.CONFLICT, "This review already exist.");
  }
  return await prisma.$transaction(async (tnx) => {
    const review = await tnx.review.create({
      data: {
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        patientId: patient.id,
        rating: Number(payload.rating),
        comment: payload.comment!,
      },
    });

    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointment.doctorId,
      },
    });

    await tnx.doctor.update({
      where: {
        id: appointment.doctorId,
      },
      data: {
        rating: Number(avgRating._avg.rating),
      },
    });

    return review;
  });
};

export const ReviewServices = {
  create,
};
