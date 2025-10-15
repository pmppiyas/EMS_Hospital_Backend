import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../config/prisma";
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

export const ScheduleServices = {
  createSchedule,
};
