import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
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

    return createAppointment;
  });

  return result;
};

export const AppointmentService = {
  create,
};
