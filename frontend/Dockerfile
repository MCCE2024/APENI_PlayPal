# Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy the pre-built artifacts from the CI environment
COPY dist /usr/share/nginx/html

EXPOSE 80

# Nginx image's default entrypoint handles envsubst for files in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]