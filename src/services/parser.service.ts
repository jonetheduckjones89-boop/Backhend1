import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedDocument } from '../types';
import { AppError } from '../middlewares/error.middleware';

export class ParserService {
    /**
     * Parse uploaded file based on its type
     */
    async parseFile(filePath: string, mimeType: string): Promise<ParsedDocument> {
        try {
            if (mimeType === 'application/pdf') {
                return await this.parsePDF(filePath);
            } else if (
                mimeType ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                return await this.parseDOCX(filePath);
            } else {
                throw new AppError('Unsupported file type', 400);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to parse file', 500);
        } finally {
            // Clean up uploaded file
            await this.cleanupFile(filePath);
        }
    }

    /**
     * Parse PDF file
     */
    private async parsePDF(filePath: string): Promise<ParsedDocument> {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);

        return {
            content: data.text,
            metadata: {
                pageCount: data.numpages,
                wordCount: this.countWords(data.text),
            },
        };
    }

    /**
     * Parse DOCX file
     */
    private async parseDOCX(filePath: string): Promise<ParsedDocument> {
        const result = await mammoth.extractRawText({ path: filePath });

        return {
            content: result.value,
            metadata: {
                wordCount: this.countWords(result.value),
            },
        };
    }

    /**
     * Count words in text
     */
    private countWords(text: string): number {
        return text.trim().split(/\s+/).length;
    }

    /**
     * Clean up temporary file
     */
    private async cleanupFile(filePath: string): Promise<void> {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Failed to delete file:', filePath, error);
        }
    }
}

export const parserService = new ParserService();
