FROM node:17.3.1 as builder

COPY . /app

WORKDIR  /app

RUN corepack enable && \
    yarn install --dev

RUN npm run test && \
    npm run build

FROM node:17.3.1-slim

COPY --from=builder /app/dist /app

ENTRYPOINT ["node"]
CMD ["/app/main.js"]

