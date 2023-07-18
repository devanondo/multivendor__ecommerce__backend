import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ShopRoutes } from '../modules/shop/shop.route';
import { ProductRoutes } from '../modules/product/product.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { OrderRoutes } from '../modules/order/order.route';
const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/category',
        route: CategoryRoutes,
    },
    {
        path: '/shop',
        route: ShopRoutes,
    },
    {
        path: '/product',
        route: ProductRoutes,
    },
    {
        path: '/review',
        route: ReviewRoutes,
    },
    {
        path: '/order',
        route: OrderRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
