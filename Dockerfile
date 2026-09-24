# syntax=docker/dockerfile:1
# Image de production pour l'application Next.js 14 (Trading Education)
# Utilisée par Coolify (Build Pack = Dockerfile, Dockerfile Location = /Dockerfile)

# ---------- Étape 1 : installation des dépendances ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Le schéma Prisma est nécessaire car `postinstall` exécute `prisma generate`
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---------- Étape 2 : build de l'application ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate && npm run build

# ---------- Étape 3 : image d'exécution (standalone) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    STORAGE_DIR=/app/storage

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs \
 && mkdir -p /app/storage/rapports /app/storage/images \
 && chown -R nextjs:nodejs /app/storage

# CLI Prisma disponible dans l'IMAGE D'EXÉCUTION (et pas seulement au build) :
# `npm run db:deploy` et `npm run db:seed` s'exécutent alors depuis le terminal
# du conteneur (Coolify → Terminal). Version épinglée = celle de package.json.
RUN npm install -g prisma@6.19.3 --no-fund --no-audit

# Fichiers statiques + serveur standalone généré par `next build`
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Client Prisma (moteur de requête) + schéma/migrations pour `prisma migrate deploy`.
# `node_modules/.prisma` et `node_modules/@prisma` sont tracés explicitement car le
# build standalone ne les embarque pas toujours (moteur natif).
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Scripts d'exploitation + sources (`npm run db:import-guides` lit
# `app/[locale]/guides/*.tsx` pour importer les 10 guides en base : contenu réel
# indispensable à l'évaluation AdSense). Volume négligeable (~0,4 Mo).
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/app ./app

# Volumes persistants recommandés dans Coolify : /app/storage
VOLUME ["/app/storage"]

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
