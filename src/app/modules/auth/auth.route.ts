import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateData from '../../../middlewares/validateRequest';
import { AuthZodValidation } from './autn.validation';

const router = Router();

router
    .route('/')
    .post(
        validateData(AuthZodValidation.loginZodSchema),
        AuthController.loginUser
    );

export const AuthRoutes = router;
