FROM node:22-alpine AS dependencies
WORKDIR /app/backend/render-api
COPY backend/render-api/package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/backend/render-api
RUN addgroup -S app && adduser -S app -G app
# As funções compartilhadas ficam em /app/functions e também precisam
# resolver firebase-admin/@google/genai. O diretório comum em /app/node_modules
# é encontrado tanto por elas quanto pela API em /app/backend/render-api.
COPY --chown=app:app --from=dependencies /app/backend/render-api/node_modules /app/node_modules
COPY --chown=app:app backend/render-api ./
COPY --chown=app:app functions/src /app/functions/src
USER app
EXPOSE 8080
CMD ["node", "server.mjs"]
