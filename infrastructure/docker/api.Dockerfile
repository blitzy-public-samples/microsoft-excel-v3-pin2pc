# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# Human tasks (commented):
# TODO: Review and adjust Node.js version if necessary
# TODO: Ensure all required environment variables are properly set
# TODO: Optimize Dockerfile for production use (multi-stage build, security scanning)