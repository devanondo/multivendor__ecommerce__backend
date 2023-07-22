import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

// All routes should be wrapped by auth()

router
    .route('/')
    .post(OrderController.createOrder)
    .get(OrderController.getOrders);

router.route('/:id').get(OrderController.getSingleOrder);

router.route('/shop/:id').get(OrderController.getAShopOrders); // admin | superadmin | shop_owner;

router.route('/customer/:id').get(OrderController.getCustomerOrders);

router.route('/cancel_request/:id').get(OrderController.requestToCancleOrder); // Request to cancle order by customer

router
    .route('/accept_cancel_request/:id')
    .get(OrderController.acceptCancelRequest); // Accept Request to cancle order by admin | superadmin

// Update single product order status --> shop_owner | admin | superadmin
router
    .route('/change_product_order_status')
    .patch(OrderController.changeOrderProductStatus); // Accept Request to cancle order by admin | superadmin

// Change order status by admin | superadmin
router.route('/status').patch(OrderController.changeStatus); // Accept Request to cancle order by admin | superadmin

export const OrderRoutes = router;
