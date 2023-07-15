import { Router } from 'express';
import { auth } from '../../../middlewares/auth';
import validateData from '../../../middlewares/validateRequest';
import { ShopZodValidation } from './shop.validation';
import { ShopController } from './shop.controller';

const router = Router();

router
    .route('/')
    .post(
        auth(),
        validateData(ShopZodValidation.createShopZodSchema),
        ShopController.createShop
    )
    .get(ShopController.getShops);

router
    .route('/:id')
    .get(ShopController.getSingleShop) // Get single shop
    .patch(
        auth(),
        validateData(ShopZodValidation.updateShopZodSchema),
        ShopController.updateSingleShop
    ); // Update Single shop by --> admin | superadmin | vendor

router
    .route('/active_staus/:id')
    .patch(
        auth(),
        validateData(ShopZodValidation.updateShopActiveStatusZodSchema),
        ShopController.updateSingleShop
    ); // Only accessed by the admin | superadmin

export const ShopRoutes = router;
