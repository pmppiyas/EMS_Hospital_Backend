import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { scheduleRoutes } from "../module/schedule/schedule.routes";
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
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
