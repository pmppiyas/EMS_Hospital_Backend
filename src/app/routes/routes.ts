import { Router } from "express";
import { appointmentRoutes } from "../module/appointment/appointment.routes";
import { authRoutes } from "../module/auth/auth.routes";
import { doctorRoutes } from "../module/doctor/doctor.routes";
import { doctorScheduleRoutes } from "../module/doctorSchedule/doctor.routes";
import { patientRoutes } from "../module/patient/patient.routes";
import { prescriptionRoutes } from "../module/prescription/prescription.routes";
import { reviewRoutes } from "../module/review/review.routes";
import { scheduleRoutes } from "../module/schedule/schedule.routes";
import { specialityRoutes } from "../module/speciality/speciality.routes";
import { userRoutes } from "../module/user/user.routes";

const router = Router();

interface routerArgs {
  path: string;
  route: Router;
}

const allRoutes: routerArgs[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor_schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/specialities",
    route: specialityRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/prescription",
    route: prescriptionRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
