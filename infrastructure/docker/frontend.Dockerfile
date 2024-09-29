# Build stage
FROM node:14-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve for serving the built files
RUN npm install -g serve

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Set environment variable
ENV NODE_ENV=production

# Add labels
LABEL maintainer="Microsoft Excel Team <excel-team@microsoft.com>"
LABEL version="1.0"

# Set up healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost || exit 1

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]

# Human tasks (commented)
# TODO: Review and optimize nginx configuration for production use
# TODO: Implement proper logging configuration
# TODO: Set up appropriate security measures (e.g., run as non-root user)