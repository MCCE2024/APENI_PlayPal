# Stage 1: Build the NestJS application
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json nest-cli.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
