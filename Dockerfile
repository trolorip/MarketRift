FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p /app/build-output && \
    if [ -d "$(find /app/dist -mindepth 2 -maxdepth 2 -type d -name browser | head -n 1)" ]; then \
      cp -r "$(find /app/dist -mindepth 2 -maxdepth 2 -type d -name browser | head -n 1)"/* /app/build-output/; \
    else \
      cp -r "$(find /app/dist -mindepth 1 -maxdepth 1 -type d | head -n 1)"/* /app/build-output/; \
    fi

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build-output /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]