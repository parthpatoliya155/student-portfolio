# Frontend Dockerfile (Multi-Stage Build)
# Student Portfolio - React + Vite Application
# Author: Parth Patoliya | Practical 11: Containerization with Docker

# ──── Stage 1: Build the React application ────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production bundle using Vite
RUN npm run build

# ──── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:alpine

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
