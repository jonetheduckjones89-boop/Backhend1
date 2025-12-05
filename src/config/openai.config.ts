import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required in environment variables');
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_CONFIG = {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000,
} as const;
