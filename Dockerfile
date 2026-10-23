FROM node:18-alpine

WORKDIR /app

# Copy package configurations and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Run production build
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
