import { Router } from 'express';
import { ExampleRoutes } from '../modules/example/example.route';
const router = Router();

const moduleRoutes = [
    {
        path: '/example',
        route: ExampleRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
