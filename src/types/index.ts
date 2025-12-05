export interface FileUploadRequest {
    file: Express.Multer.File;
}

export interface AIAnalysisResponse {
    status: 'success' | 'error';
    data?: {
        summary: string;
        actions: Action[];
        metadata: FileMetadata;
    };
    error?: string;
}

export interface Action {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
}

export interface FileMetadata {
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    processedAt: string;
    wordCount?: number;
    pageCount?: number;
}

export interface OpenAIRequest {
    content: string;
    fileName: string;
    fileType: string;
}

export interface ParsedDocument {
    content: string;
    metadata: {
        pageCount?: number;
        wordCount: number;
    };
}
