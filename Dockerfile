# ----------------------------- creating dependencies -----------------------------

FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockFile

# ----------------------------- building project     -----------------------------

FROM node:20-alpine AS builder 

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build
# ----------------------------- running  project     -----------------------------

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules


EXPOSE 5000

CMD ["node", "dist/main.js"]
