import { createApp, startServer } from './app';

/**
 * Main function to initialize and start the server
 */
async function main() {
  try {
    // Call createApp() to get the configured Express application
    const app = await createApp();

    // Call startServer(app) to start the server
    await startServer(app);

    // Implement error handling for any uncaught exceptions or unhandled promise rejections
    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      // Perform any necessary cleanup or logging
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Perform any necessary cleanup or logging
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

// Run the main function
main();

// List of pending human tasks
/**
 * TODO: Human Tasks
 * 1. Set up process monitoring and automatic restart (e.g., PM2) [Required]
 * 2. Implement graceful shutdown handling [Required]
 * 3. Configure environment-specific settings (development, staging, production) [Required]
 * 4. Set up centralized logging system integration [Required]
 */