import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { ProductZodValidation } from './product.validation';
import { ProductController } from './product.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

router
    .route('/')
    .post(
        auth('admin', 'superadmin', 'vendor'),
        validateData(ProductZodValidation.createProductZodSchema),
        ProductController.createProduct
    )
    .get(ProductController.getProducts);

router
    .route('/product_visibility/:id') // product_id
    .patch(
        auth('admin', 'superadmin'),
        validateData(ProductZodValidation.updateProductVislibilityZodSchema),
        ProductController.updateProductVisibility
    );

router // Only for admin | superadmin
    .route('/admin')
    .get(auth('admin', 'superadmin'), ProductController.getAllProducts)
    .patch(
        auth('admin', 'superadmin'),
        validateData(
            ProductZodValidation.updateProductVislibilityAdminZodSchema
        ),
        ProductController.updateProductVisibility
    );

router
    .route('/vendor/:id')
    .get(
        auth('admin', 'superadmin', 'vendor'),
        ProductController.getVendorProducts
    );

router // Only for admin | superadmin
    .route('/admin/product_visibility/:id')
    .patch(
        auth('admin', 'superadmin'),
        validateData(
            ProductZodValidation.updateProductVislibilityAdminZodSchema
        ),
        ProductController.updateProductVisibility
    );

router
    .route('/:id') // product_id
    .patch(
        auth('admin', 'superadmin', 'vendor'),
        validateData(ProductZodValidation.updateProductZodSchema),
        ProductController.updateSingleProducts
    )
    .get(ProductController.getSingleProducts);

router.route('/shop/:id').get(ProductController.getShopProducts); // Get a shop products

export const ProductRoutes = router;
