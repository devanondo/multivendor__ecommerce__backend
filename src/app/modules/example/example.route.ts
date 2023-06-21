import { Router } from 'express';
import { ExampleController } from './example.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { ExampleValidation } from './example.validation';

const router = Router();

router.post(
    '/',
    validateRequest(ExampleValidation.createExampleZodSchema),
    ExampleController.createExample
);
router.get('/', ExampleController.getAllExample);

export const ExampleRoutes = router;
