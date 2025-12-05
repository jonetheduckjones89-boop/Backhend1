import { Router } from 'express';
import { upload } from '../config/multer.config';
import { uploadController } from '../controllers/upload.controller';
import { validateFile } from '../middlewares/validation.middleware';

const router = Router();

/**
 * POST /api/upload
 * Upload and analyze document
 */
router.post(
    '/',
    upload.single('file'),
    validateFile,
    uploadController.uploadAndAnalyze
);

export default router;
