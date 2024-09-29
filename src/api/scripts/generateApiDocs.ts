import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs/promises';
import path from 'path';
import { createRouter } from '../routes/index';
import { apiConstants } from '../constants/apiConstants';

/**
 * Generates API documentation using Swagger/OpenAPI specification
 */
async function generateApiDocs(): Promise<void> {
  try {
    // Define Swagger options
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Excel API',
          version: '1.0.0',
          description: 'API documentation for the Excel API',
        },
        servers: [
          {
            url: apiConstants.API_BASE_URL,
            description: 'Excel API Server',
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['./src/api/routes/*.ts'], // Path to the API routes with JSDoc comments
    };

    // Generate OpenAPI specification
    const swaggerSpec = swaggerJsdoc(options);

    // Write the generated specification to a file
    const outputPath = path.join(__dirname, '..', 'docs', 'swagger.json');
    await fs.writeFile(outputPath, JSON.stringify(swaggerSpec, null, 2));

    console.log(`API documentation generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating API documentation:', error);
    throw error;
  }
}

// Execute the function
generateApiDocs().catch((error) => {
  console.error('Failed to generate API documentation:', error);
  process.exit(1);
});

// List of human tasks as comments
/**
 * Human Tasks:
 * 1. Review generated swagger.json for accuracy and completeness
 * 2. Ensure all API endpoints are properly documented with JSDoc comments
 * 3. Verify that the generated documentation aligns with Excel API design and standards
 */