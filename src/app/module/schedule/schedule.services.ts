import { Prisma } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { StatusCodes } from "http-status-codes";
import { IFilters, IJwtPayload } from "../../../types/common";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { calculatePagination } from "../../utils/calculatePagination";
import { IOptions, Role } from "../user/user.interface";
import { ISchedulePayload } from "./schedule.interface";

const createSchedule = async (payload: ISchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
  const schedules = [];

  const firstDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (firstDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(firstDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(startDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const schedule = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existing = await prisma.schedule.findFirst({
        where: schedule,
      });

      if (!existing) {
        const result = await prisma.schedule.create({
          data: schedule,
        });

        schedules.push(result);
      }

      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }

    firstDate.setDate(firstDate.getDate() + 1);
  }

  return schedules;
};

const getSchedules = async (
  user: IJwtPayload,
  filters: Partial<IFilters>,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startDateTime, endDateTime } = filters;

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime,
          },
        },
        {
          endDateTime: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorSchedulesIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const whereConditions: Prisma.ScheduleWhereInput = {
    ...(andConditions.length > 0 && { AND: andConditions }),
    ...(user.role === Role.DOCTOR && {
      id: {
        notIn: doctorSchedulesIds,
      },
    }),
  };

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteSchedule = async (id: string) => {
  const exist = await prisma.schedule.findFirst({
    where: { id },
  });

  if (!exist) {
    throw new AppError(StatusCodes.NOT_FOUND, "This schedule is not exist");
  }
  await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return;
};

export const ScheduleServices = {
  createSchedule,
  getSchedules,
  deleteSchedule,
};
