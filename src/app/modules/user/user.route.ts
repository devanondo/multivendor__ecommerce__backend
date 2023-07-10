import { Router } from 'express';
import validateData from '../../../middlewares/validateRequest';
import { UserZodValidation } from './user.validation';
import { UserController } from './user.controller';

const router = Router();

// Register User
router.post(
    '/',
    validateData(UserZodValidation.createUserZodSchema),
    UserController.createUser
);

// Register Admin

export const UserRoutes = router;
