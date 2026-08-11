FROM node:22-alpine AS dependencies
WORKDIR /app
COPY backend/render-api/package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --chown=app:app --from=dependencies /app/node_modules ./node_modules
COPY --chown=app:app backend/render-api ./
COPY --chown=app:app functions/src ./functions/src
USER app
EXPOSE 8080
CMD ["node", "server.mjs"]
