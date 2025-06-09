# 1. 建置階段
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --output-path=dist

# 2. 運行階段
FROM nginx:alpine
COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/temp.conf && \
    mv /etc/nginx/conf.d/temp.conf /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
