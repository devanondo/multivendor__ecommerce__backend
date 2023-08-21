import { Router } from 'express';
import { UploadController } from './upload.controller';

const router = Router();

router
    .route('/image')
    .post(UploadController.uploadImages)
    .delete(UploadController.deleteImages);

export const UploadRoutes = router;
