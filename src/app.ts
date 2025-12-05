import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/upload', uploadRoutes);

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
app.use(errorHandler);

export default app;
