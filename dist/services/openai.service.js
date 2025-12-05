"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
exports.generateCompletion = generateCompletion;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set in environment variables.');
}
exports.openai = new openai_1.default({
    apiKey: apiKey || 'dummy-key', // Fallback to avoid crash on startup if key missing
});
function generateCompletion(prompt_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, systemPrompt = 'You are a helpful assistant.') {
        var _a, _b;
        if (!apiKey)
            throw new Error("OPENAI_API_KEY not set.");
        try {
            const response = yield exports.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            });
            return ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '';
        }
        catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to generate completion');
        }
    });
}
