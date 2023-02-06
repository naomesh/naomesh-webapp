
FROM node:18-alpine as build
WORKDIR app
COPY ./ /app/
RUN npm install
RUN npm run build

FROM nginx:latest as expose
COPY --from=build app/dist/naomesh-webapp /usr/share/nginx/html
EXPOSE 80/tcp