FROM node:20-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the Vite development server and bind to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]
