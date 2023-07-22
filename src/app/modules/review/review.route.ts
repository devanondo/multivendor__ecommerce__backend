import { Router } from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

router.route('/').post(auth('customer'), ReviewController.createReview);

export const ReviewRoutes = router;
