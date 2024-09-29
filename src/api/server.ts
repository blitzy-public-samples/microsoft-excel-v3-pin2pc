import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Assuming these modules will be implemented later
import { createRouter } from './routes/index';
import { ApiConfig, loadEnvironmentConfig } from './config/apiConfig';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { auth } from './middleware/auth';
import { apiLogger } from './logging/apiLogger';

const app: Express = express();

function createServer(): Express {
  // Apply security middleware
  app.use(helmet());

  // Apply CORS middleware
  app.use(cors());

  // Apply compression middleware
  app.use(compression());

  // Apply JSON body parser
  app.use(express.json());

  // Apply URL-encoded body parser
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiter middleware
  app.use(rateLimiter);

  // Apply authentication middleware
  app.use(auth);

  // Apply API logging middleware
  app.use(apiLogger);

  // Mount the main router
  app.use('/api', createRouter());

  // Apply error handling middleware
  app.use(errorHandler);

  return app;
}

function startServer(app: Express): void {
  const config: ApiConfig = loadEnvironmentConfig();
  const port: number = config.port || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

const server = createServer();
startServer(server);

export { server };

// Human tasks:
// TODO: Review and approve the server configuration and middleware stack
// TODO: Implement proper error handling for server startup failures
// TODO: Configure SSL/TLS for HTTPS support in production
// TODO: Set up health check endpoint for monitoring
// TODO: Implement graceful shutdown handling
// TODO: Consider implementing API versioning strategy