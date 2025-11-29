# runtime-only Dockerfile: expects ./dist to be prebuilt by CI
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy built artifacts from the build context
COPY dist ./dist

EXPOSE 3005
CMD ["node", "dist/main.js"]
