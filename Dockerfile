# Use an official Node.js runtime as a parent image
FROM node:20-alpine3.19 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Leverage Docker cache to save time on dependency installation
COPY package*.json ./

# Install dependencies 
RUN npm install --production

# Copy the rest of your application code to the container
COPY . .

# Generate Prisma Client code
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the port that your NestJS app runs on
EXPOSE 3333

# Command to run the app
CMD [  "npm", "run", "start:migrate:prod" ]
