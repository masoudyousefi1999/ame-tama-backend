# ----------------------------- creating dependencies -----------------------------

FROM node:20-bullseye-slim AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn add --frozen-lockfile --ignore-scripts=false
# ----------------------------- building project     -----------------------------

FROM node:20-bullseye-slim AS builder 

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build
# ----------------------------- running  project     -----------------------------

FROM node:20-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

RUN yarn add --frozen-lockfile --production

EXPOSE 5000

CMD ["node", "dist/main.js"]
