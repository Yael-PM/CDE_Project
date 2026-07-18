FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM caddy:2-alpine

WORKDIR /app

COPY Caddyfile ./Caddyfile
COPY --from=build /app/dist ./dist

CMD ["caddy", "run", "--config", "/app/Caddyfile", "--adapter", "caddyfile"]
