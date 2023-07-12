import { Router } from 'express';
import { CategoryController } from './category.controller';
import validateData from '../../../middlewares/validateRequest';
import { CategroyZodValidation } from './category.validation';

const router = Router();

router
    .route('/')
    .post(
        validateData(CategroyZodValidation.createCategoryZodSchema),
        CategoryController.createCategory
    )
    .get(CategoryController.getCategory);

router.route('/:id').get(CategoryController.getSingleCategory);

router
    .route('/sub_category/:id')
    .post(
        validateData(CategroyZodValidation.createSubCategoryZodSchema),
        CategoryController.addSubCategory
    );

router.route('/active_status/:id').patch(CategoryController.approveCategory);
router
    .route('/sub_active_status/:id')
    .patch(CategoryController.approveSubCategory);

export const CategoryRoutes = router;
