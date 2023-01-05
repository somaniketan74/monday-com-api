import express from 'express';
import settingRoute from './setting.route';
import documentRoute from './document.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/setting',
    route: settingRoute,
  },
  {
    path: '/document',
    route: documentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
