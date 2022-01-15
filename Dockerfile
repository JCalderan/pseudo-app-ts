FROM node:17.3.1 as builder

COPY . /app

WORKDIR  /app

RUN corepack enable && \
    yarn install --dev

RUN yarn run test && \
    yarn run build

FROM node:17.3.1-slim

COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules

ENTRYPOINT ["node"]
CMD ["/app/main.js"]

