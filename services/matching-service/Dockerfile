FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

# Copy the pre-built application from the CI environment
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]