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

router
    .route('/:id') // product_id
    .patch(
        auth(),
        validateData(ProductZodValidation.updateProductZodSchema),
        ProductController.updateSingleProducts
    )
    .get(ProductController.getSingleProducts);

router
    .route('/product_visibility/:id') // product_id
    .patch(
        auth(),
        validateData(ProductZodValidation.updateProductVislibilityZodSchema),
        ProductController.updateProductVisibility
    );

router // Only for admin | superadmin
    .route('/admin')
    .get(ProductController.getAllProducts)
    .patch(
        auth(),
        validateData(
            ProductZodValidation.updateProductVislibilityAdminZodSchema
        ),
        ProductController.updateProductVisibility
    );

router // Only for admin | superadmin
    .route('/admin/product_visibility/:id')
    .patch(
        auth(),
        validateData(
            ProductZodValidation.updateProductVislibilityAdminZodSchema
        ),
        ProductController.updateProductVisibility
    );

export const ProductRoutes = router;
