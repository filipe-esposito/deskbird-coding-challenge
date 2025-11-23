FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000 4200

CMD ["npx", "nx", "run-many", "-t", "serve"]