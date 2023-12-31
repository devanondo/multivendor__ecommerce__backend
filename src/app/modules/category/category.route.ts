import { Router } from 'express';
import { CategoryController } from './category.controller';
import validateData from '../../../middlewares/validateRequest';
import { CategroyZodValidation } from './category.validation';
import { auth } from '../../../middlewares/auth';

const router = Router();

router
    .route('/')
    .post(
        auth('admin', 'superadmin'),
        validateData(CategroyZodValidation.createCategoryZodSchema),
        CategoryController.createCategory
    )
    .get(CategoryController.getCategory);

router
    .route('/:id')
    .get(CategoryController.getSingleCategory)
    .patch(auth('admin', 'superadmin'), CategoryController.updateCategory);

router
    .route('/sub_category/:id')
    .post(
        auth('admin', 'superadmin'),
        validateData(CategroyZodValidation.createSubCategoryZodSchema),
        CategoryController.addSubCategory
    );

router
    .route('/active_status/:id')
    .patch(
        auth('admin', 'superadmin'),
        CategoryController.changeCategoryStatus
    );
router
    .route('/sub_active_status/:id')
    .patch(
        auth('admin', 'superadmin'),
        CategoryController.changeSubCategoryStatus
    );

export const CategoryRoutes = router;
