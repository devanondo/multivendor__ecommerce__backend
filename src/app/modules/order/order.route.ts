import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

// All routes should be wrapped by auth()

router
    .route('/')
    .post(OrderController.createOrder)
    .get(OrderController.getOrders);

router.route('/:id').get(OrderController.getSingleOrder);

router.route('/shop/:id').get(OrderController.getAShopOrders);
router.route('/customer/:id').get(OrderController.getCustomerOrders);

export const OrderRoutes = router;
