import { Router } from 'express';
import { OrderController } from './order.controller';
import validateData from '../../../middlewares/validateRequest';
import { OrderZodValidation } from './order.validation';
import { auth } from '../../../middlewares/auth';

const router = Router();

// All routes should be wrapped by auth()

router
    .route('/')
    .post(
        auth('customer'),
        validateData(OrderZodValidation.createOrderZodSchema),
        OrderController.createOrder
    )
    .get(OrderController.getOrders);

router.route('/:id').get(auth(), OrderController.getSingleOrder);

router
    .route('/shop/:id')
    .get(auth('admin', 'superadmin', 'vendor'), OrderController.getAShopOrders); // admin | superadmin | shop_owner;

router.route('/customer/:id').get(auth(), OrderController.getCustomerOrders);

router
    .route('/cancel_request/:id')
    .get(auth('customer'), OrderController.requestToCancleOrder); // Request to cancle order by customer

router
    .route('/accept_cancel_request/:id')
    .get(auth('admin', 'superadmin'), OrderController.acceptCancelRequest); // Accept Request to cancle order by admin | superadmin

// Update single product order status --> shop_owner | admin | superadmin
router
    .route('/change_product_order_status')
    .patch(
        auth('admin', 'superadmin', 'vendor'),
        validateData(OrderZodValidation.changeOrderProductStatusZodSchema),
        OrderController.changeOrderProductStatus
    );

// Change order status by admin | superadmin
router
    .route('/status')
    .patch(
        auth('admin', 'superadmin'),
        validateData(OrderZodValidation.changeOrderStatusZodSchema),
        OrderController.changeStatus
    );

export const OrderRoutes = router;
