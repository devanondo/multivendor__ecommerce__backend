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

export const ShopRoutes = router;
