import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import projectRoutes from './routes/project.routes.js';
import donationRoutes from './routes/donation.routes.js';
import Database from './utils/database.js';
import logger from './utils/logger.js';
import config from './config/index.js';

// Create Express app
const app = express();

// Initialize database connection
async function initializeDatabase() {
  try {
    const db = Database.getInstance();
    await db.connect();

    // Optional: Seed database in development
    if (config.nodeEnv === 'development' && process.env.SEED_DATABASE === 'true') {
      logger.info('Seeding database...');
      const { seedDatabase } = await import('./scripts/seed.js');
      await seedDatabase();
    }

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed', { error: (error as Error).message });
    process.exit(1);
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
  });
  next();
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = Database.getInstance();
    const dbHealth = await db.healthCheck();

    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      database: dbHealth ? 'connected' : 'disconnected',
      version: config.apiVersion,
    };

    const statusCode = dbHealth ? 200 : 503; // 503 Service Unavailable if DB is down

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message });
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'error',
    });
  }
});

// API version prefix
const apiPrefix = `/api/${config.apiVersion}`;
app.use(`${apiPrefix}/projects`, projectRoutes);
app.use(`${apiPrefix}/donate`, donationRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Donation Tracker API',
    version: config.apiVersion,
    endpoints: {
      health: '/health',
      projects: `${apiPrefix}/projects`,
      donate: `${apiPrefix}/donate`,
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  logger.error('Unhandled error', {
    error: message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const isDevelopment = config.nodeEnv === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Start the HTTP server
    app.listen(config.port, () => {
      logger.info(`Server is running on http://localhost:${config.port}`, {
        environment: config.nodeEnv,
        apiVersion: config.apiVersion,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: (error as Error).message });
    process.exit(1);
  }
}

startServer();
