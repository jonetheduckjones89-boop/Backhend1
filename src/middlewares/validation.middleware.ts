import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './error.middleware';

export const validateFile = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }

    const allowedMimes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimes.includes(req.file.mimetype)) {
        throw new AppError('Invalid file type. Only PDF and DOCX are allowed', 400);
    }

    next();
};
