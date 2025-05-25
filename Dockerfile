FROM node:lts-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add --update --no-cache python3 make gcc g++
RUN npm install
COPY . .
RUN npm run build

FROM base AS release

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs allesbot
USER allesbot

WORKDIR /app
COPY --from=builder --chown=allesbot:nodejs /app/dist ./dist
COPY --from=builder --chown=allesbot:nodejs /app/package*.json ./
VOLUME ["/app/db"]


RUN npm install --omit dev
CMD ["node", "dist/index.js"]
