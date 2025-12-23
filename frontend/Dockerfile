# Serve the application with Nginx
FROM nginx:alpine

# Copy the pre-built artifacts from the CI environment
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]