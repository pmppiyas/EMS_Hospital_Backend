import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const createSchedule = async (
  user: IJwtPayload,
  payload: { schedulesIds: string[] }
) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Doctor is missing!");
  }

  const scheduleData = payload.schedulesIds.map((id) => ({
    doctorId: doctor.id,
    scheduleId: id,
  }));

  return await prisma.doctorSchedules.createMany({
    data: scheduleData,
    skipDuplicates: true,
  });
};

export const DoctorScheduleServices = {
  createSchedule,
};
