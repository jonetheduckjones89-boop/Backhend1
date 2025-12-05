"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// Start server
app_1.default.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 AI Agent Backend Started`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Missing'}`);
    console.log('=================================');
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
