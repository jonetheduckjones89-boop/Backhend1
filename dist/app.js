"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/health', health_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'MedCore AI Agent Backend',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            upload: '/api/upload',
        },
    });
});
// Global error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
