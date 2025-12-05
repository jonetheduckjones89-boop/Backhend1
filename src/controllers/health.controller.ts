import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';

export class HealthController {
    /**
     * Health check endpoint
     */
    check = asyncHandler(async (req: Request, res: Response) => {
        return res.status(200).json({
            status: 'success',
            message: 'AI Agent Backend is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        });
    });
}

export const healthController = new HealthController();
