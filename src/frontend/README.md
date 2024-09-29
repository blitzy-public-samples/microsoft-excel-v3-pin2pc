# Microsoft Excel Frontend

This directory contains the frontend code for the web-based version of Microsoft Excel, built using modern web technologies to provide a powerful and responsive spreadsheet application in the browser.

## Technologies Used

- React: For building the user interface
- TypeScript: For type-safe JavaScript development
- Redux: For state management
- React Router: For handling routing in the single-page application
- Sass: For styling components
- D3.js: For advanced chart rendering

## Getting Started

1. Ensure you have Node.js (version 14 or later) and npm installed
2. Clone the repository
3. Navigate to the `src/frontend` directory
4. Run `npm install` to install dependencies
5. Run `npm start` to start the development server
6. Open `http://localhost:3000` in your browser

## Project Structure

- `src/`: Source code directory
  - `components/`: React components
  - `hooks/`: Custom React hooks
  - `contexts/`: React contexts
  - `services/`: API and other services
  - `utils/`: Utility functions
  - `styles/`: Global styles and themes
  - `localization/`: Internationalization files
- `public/`: Public assets
- `tests/`: Test files

## Development Guidelines

- Follow the React Hooks pattern for state management in functional components
- Use TypeScript for all new code to ensure type safety
- Write unit tests for all new components and utilities
- Follow the established folder structure for organizing code
- Use the shared constants and types from the `shared` directory

## Building for Production

Run `npm run build` to create a production-ready build in the `build/` directory

## Contributing

Please read the CONTRIBUTING.md file in the root directory for guidelines on how to contribute to this project

## Human Tasks

The following tasks are pending for human review:

- [Required] Review and update the README content to ensure it accurately reflects the current state of the frontend implementation
- [Optional] Add specific version numbers for key dependencies once they are finalized