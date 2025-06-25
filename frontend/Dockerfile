# Step 1: React 앱 빌드용 Node 환경
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Nginx로 정적 파일 서비스
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
