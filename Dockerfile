# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_SITE_URL="https://www.itnavideo.com"
ENV NEXT_PUBLIC_API_BASE_URL="https://www.itnavideo.com/api"
ENV NEXT_PUBLIC_SUPABASE_URL="https://veqkjrcewfwtlepnyjfc.supabase.co"
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_TDIcPcfQ6jFu3F"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dhouh9idx"

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache ffmpeg libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_SITE_URL="https://www.itnavideo.com"
ENV NEXT_PUBLIC_API_BASE_URL="https://www.itnavideo.com/api"
ENV NEXT_PUBLIC_SUPABASE_URL="https://veqkjrcewfwtlepnyjfc.supabase.co"
ENV AWS_REGION="us-east-1"
ENV AWS_ASSET_BUCKET="remotionlambda-useast1-2zq6twaok1"
ENV AWS_ASSET_REGION="us-east-1"
ENV REMOTION_AWS_REGION="us-east-1"
ENV REMOTION_BUCKET_NAME="remotionlambda-useast1-2zq6twaok1"
ENV REMOTION_LAMBDA_BUCKET_NAME="remotionlambda-useast1-2zq6twaok1"
ENV REMOTION_LAMBDA_SITE_NAME="itnavideo-render-30fps"
ENV REMOTION_LAMBDA_FUNCTION_NAME="remotion-render-4-0-467-mem3008mb-disk2048mb-900sec"
ENV REMOTION_LAMBDA_SERVE_URL="https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html"
ENV RAZORPAY_KEY_ID="rzp_live_TDIcPcfQ6jFu3F"
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_TDIcPcfQ6jFu3F"
ENV CLOUDINARY_CLOUD_NAME="dhouh9idx"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dhouh9idx"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
