import { openai, OPENAI_CONFIG } from '../config/openai.config';
import { OpenAIRequest, Action } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { v4 as uuidv4 } from 'uuid';

export class AIService {
    /**
     * Analyze document content using OpenAI
     */
    async analyzeDocument(request: OpenAIRequest): Promise<{
        summary: string;
        actions: Action[];
    }> {
        try {
            const prompt = this.buildPrompt(request);

            const completion = await openai.chat.completions.create({
                model: OPENAI_CONFIG.model,
                temperature: OPENAI_CONFIG.temperature,
                max_tokens: OPENAI_CONFIG.maxTokens,
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI document analysis agent. Your task is to analyze documents and extract:
1. A concise summary of the document
2. Actionable items with priorities

Return your response in the following JSON format:
{
  "summary": "Brief summary of the document",
  "actions": [
    {
      "title": "Action title",
      "description": "Detailed description",
      "priority": "high|medium|low",
      "category": "Category name"
    }
  ]
}`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const responseContent = completion.choices[0]?.message?.content;

            if (!responseContent) {
                throw new AppError('No response from AI', 500);
            }

            return this.parseAIResponse(responseContent);
        } catch (error: any) {
            console.error('OpenAI API Error:', error);

            if (error.status === 401) {
                throw new AppError('Invalid OpenAI API key', 500);
            }

            if (error instanceof AppError) throw error;
            throw new AppError('Failed to analyze document with AI', 500);
        }
    }

    /**
     * Build prompt for OpenAI
     */
    private buildPrompt(request: OpenAIRequest): string {
        return `Analyze the following ${request.fileType} document titled "${request.fileName}":

${request.content}

Please provide:
1. A comprehensive summary (2-3 paragraphs)
2. A list of actionable items extracted from the document with priorities and categories`;
    }

    /**
     * Parse AI response into structured format
     */
    private parseAIResponse(response: string): {
        summary: string;
        actions: Action[];
    } {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Add unique IDs to actions
            const actions: Action[] = (parsed.actions || []).map((action: any) => ({
                id: uuidv4(),
                title: action.title || 'Untitled Action',
                description: action.description || '',
                priority: action.priority || 'medium',
                category: action.category || 'General',
            }));

            return {
                summary: parsed.summary || 'No summary available',
                actions,
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);

            // Fallback: return raw response as summary
            return {
                summary: response,
                actions: [],
            };
        }
    }
}

export const aiService = new AIService();
