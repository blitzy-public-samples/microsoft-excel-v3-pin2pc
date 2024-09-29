# Microsoft Excel Backend

This is the backend server for the Microsoft Excel application, providing API endpoints for workbook management, data processing, and collaboration features.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Azure SQL Database
- Azure Cosmos DB
- Azure Blob Storage
- Microsoft Graph API

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- Azure account with necessary services set up

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Run `npm install` to install dependencies
4. Set up environment variables (see Configuration section)
5. Run `npm run dev` to start the development server

## Configuration

Create a `.env` file in the root of the backend directory with the following variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_azure_sql_connection_string
COSMOS_DB_ENDPOINT=your_cosmos_db_endpoint
COSMOS_DB_KEY=your_cosmos_db_key
BLOB_STORAGE_CONNECTION_STRING=your_blob_storage_connection_string
JWT_SECRET=your_jwt_secret
MICROSOFT_GRAPH_CLIENT_ID=your_graph_client_id
MICROSOFT_GRAPH_CLIENT_SECRET=your_graph_client_secret
MICROSOFT_GRAPH_TENANT_ID=your_graph_tenant_id
```

## Project Structure

- `app.ts`: Main application file
- `server.ts`: Server entry point
- `config/`: Configuration files
- `controllers/`: Request handlers
- `models/`: Data models
- `routes/`: API route definitions
- `services/`: Business logic and external service integrations
- `middleware/`: Custom middleware functions
- `utils/`: Utility functions and helpers
- `tests/`: Unit and integration tests

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Testing

- Run unit tests: `npm test`
- Run integration tests: `npm run test:integration`

## Deployment

Deployment instructions for Azure App Service or other cloud platforms.

## Contributing

Guidelines for contributing to the project, including coding standards and pull request process.

## License

Specify the license under which the project is distributed.

---

## TODO

The following tasks are pending for this README:

- Add specific deployment instructions for the chosen cloud platform (Required)
- Create and link to a CONTRIBUTING.md file with detailed contribution guidelines (Optional)
- Update the list of environment variables if any new ones are added during development (Required)
- Add troubleshooting section for common issues developers might encounter (Optional)
- Include information about the project's continuous integration and deployment setup (Required)