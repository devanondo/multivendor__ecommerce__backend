import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { ProductZodValidation } from './product.validation';
import { ProductController } from './product.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

router
    .route('/')
    .post(
        auth(),
        validateData(ProductZodValidation.createProductZodSchema),
        ProductController.createProduct
    )
    .get(ProductController.getProducts);

export const ProductRoutes = router;
