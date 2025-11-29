# runtime-only Dockerfile: expects ./dist to be prebuilt by CI
FROM nginx:1.27-alpine AS runner

# Copy prebuilt static assets from the build context
COPY dist /usr/share/nginx/html

# Default Nginx image already listens on 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
