# 1. Use lightweight Node image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (for caching)
COPY package*.json ./

# 4. Install dependencies (only prod deps later)
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build TypeScript
RUN npm run build

# 7. Remove dev dependencies (optimize image)
RUN npm prune --production

# 8. Copy ssl for db
COPY certs ./certs

# 9. Expose port
EXPOSE 8080

# 10. Start app
CMD ["node", "dist/server.js"]