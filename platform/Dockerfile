# Çok aşamalı derleme (plan 0.6). Bağlam: platform/ klasörü (compose.yml bunu kullanır).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Çalışma imajı: yalnızca standalone çıktı, statik dosyalar ve genel klasör.
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# Şema ve tohum açılışta uygulanır (docker-entrypoint.sh); db/ ve data.js bunun için gerekir.
COPY --from=build --chown=app:app /app/db ./db
COPY --chown=app:app docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && mkdir -p ./public/uploads && chown app:app ./public/uploads
USER app
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
