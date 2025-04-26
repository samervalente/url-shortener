
FROM node:alpine AS builder

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN find . -name libquery_engine-linux-musl-openssl-3.0.x.so.node | head -n 1 | xargs -I {} cp {} /tmp/
RUN apk add --no-cache python3 make g++ && rm -rf /var/cache/apk/*
RUN apk add --no-cache openssl3 
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=./libs/iam-db/prisma/schema.prisma 

RUN npx nx build iam

# Final stage
FROM node:alpine

# Copy built app
COPY --from=builder /app/dist/apps/iam .
COPY --from=builder /app/dist/apps/iam/package*.json .

# Copy prisma schema and client
COPY --from=builder /app/node_modules/@prisma/client/ ./node_modules/@prisma/client/
COPY --from=builder /app/libs/iam-db/prisma/ ./prisma/
COPY --from=builder /app/db/iam/libquery_engine-linux-musl-openssl-3.0.x.so.node ./db/iam/

# Install production dependencies in the app directory
RUN npm install --legacy-peer-deps --omit=dev

EXPOSE 3003

# Change CMD to run migrations before starting
CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node main.js"]
