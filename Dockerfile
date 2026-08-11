FROM node:22-alpine AS dependencies
WORKDIR /app
COPY backend/render-api/package*.json ./
RUN npm install --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY backend/render-api ./
COPY functions/src ./functions/src
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 8080
CMD ["node", "server.mjs"]
