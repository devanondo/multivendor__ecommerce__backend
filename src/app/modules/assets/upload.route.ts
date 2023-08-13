import { Router } from 'express';
import { UploadController } from './upload.controller';

const router = Router();

router.route('/image').post(UploadController.uploadImages);

export const UploadRoutes = router;
