import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { UserZodValidation } from './user.validation';
import { UserController } from './user.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

// Action with single --> id
router
    .route('/:id')
    .get(auth(), UserController.getSingleUsers)
    .patch(
        auth(),
        validateData(UserZodValidation.updateUserZodSchema),
        UserController.updateUser
    );

// Action --> User Profile
// router.route('/me')

// Action in the root route --> /
router
    .route('/')
    .get(auth(), UserController.getUsers)
    .post(
        validateData(UserZodValidation.createUserZodSchema),
        UserController.createUser
    );

// Register Admin
router
    .route('/admin')
    .post(
        auth('superadmin'),
        validateData(UserZodValidation.createAdminZodSchema),
        UserController.createAdmin
    );

export const UserRoutes = router;
