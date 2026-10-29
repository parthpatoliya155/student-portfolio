# Backend Dockerfile
# Task Manager API - Node.js/Express Application
# Author: Parth Patoliya | Practical 11: Containerization with Docker

# Step 1: Use official Node.js LTS image as the base
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files first (for Docker layer caching optimization)
COPY package*.json ./

# Step 4: Install production dependencies only
RUN npm install --production

# Step 5: Copy the rest of the application source code
COPY . .

# Step 6: Expose the backend port
EXPOSE 5000

# Step 7: Start the Node.js server
CMD ["node", "src/server.js"]
