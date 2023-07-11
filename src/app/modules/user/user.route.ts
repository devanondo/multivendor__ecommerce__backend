import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { UserZodValidation } from './user.validation';
import { UserController } from './user.controller';

const router = Router();

// Action with single --> id
router
    .route('/:id')
    .patch(
        validateData(UserZodValidation.updateUserZodSchema),
        UserController.updateUser
    );

// Action in the root route --> /
router
    .route('/')
    .get(UserController.getUsers)
    .post(
        validateData(UserZodValidation.createUserZodSchema),
        UserController.createUser
    );

// Register Admin

export const UserRoutes = router;
