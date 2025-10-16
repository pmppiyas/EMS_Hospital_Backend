export interface ISchedulePayload {
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
}

export interface IJwtPayload {
  email: string;
  role: string;
}

export interface IFilters {
  startDateTime: string;
  endDateTime: string;
}
