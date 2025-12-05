import { Request, Response } from 'express';
import { parserService } from '../services/parser.service';
import { aiService } from '../services/ai.service';
import { AIAnalysisResponse } from '../types';
import { asyncHandler } from '../middlewares/error.middleware';

export class UploadController {
    /**
     * Handle file upload and AI analysis
     */
    uploadAndAnalyze = asyncHandler(async (req: Request, res: Response) => {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 'error',
                error: 'No file uploaded',
            });
        }

        const uploadedAt = new Date().toISOString();

        // Step 1: Parse the uploaded file
        const parsedDocument = await parserService.parseFile(
            file.path,
            file.mimetype
        );

        // Step 2: Analyze with OpenAI
        const aiAnalysis = await aiService.analyzeDocument({
            content: parsedDocument.content,
            fileName: file.originalname,
            fileType: file.mimetype,
        });

        const processedAt = new Date().toISOString();

        // Step 3: Build response
        const response: AIAnalysisResponse = {
            status: 'success',
            data: {
                summary: aiAnalysis.summary,
                actions: aiAnalysis.actions,
                metadata: {
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    uploadedAt,
                    processedAt,
                    wordCount: parsedDocument.metadata.wordCount,
                    pageCount: parsedDocument.metadata.pageCount,
                },
            },
        };

        return res.status(200).json(response);
    });
}

export const uploadController = new UploadController();
