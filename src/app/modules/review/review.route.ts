import { Router } from 'express';
import { ReviewController } from './review.controller';

const router = Router();

router.route('/').post(ReviewController.createReview);

export const ReviewRoutes = router;
