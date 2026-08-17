# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2 (default): Serve with nginx — used by dev/local setup
FROM nginx:alpine AS dev

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Production build-only — used by docker-compose.prod.yml
FROM alpine:3.19 AS prod

COPY --from=build /app/dist /app/dist-built

# Copy the built files to the mounted volume at startup so it always stays up-to-date
CMD ["sh", "-c", "rm -rf /app/dist/* && cp -rf /app/dist-built/. /app/dist/ && echo 'Frontend build complete'"]
