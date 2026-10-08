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
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODA4MDMsImV4cCI6MjA5NDM1NjgwM30.6vPjV-m8a2Ag9DCNv8b95dxeIG2GkKGrRj6PI7fWt4Y"
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_kvWfyUSg_SihO3Mnp93TKw_AJVntAiU"
ENV SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4MDgwMywiZXhwIjoyMDk0MzU2ODAzfQ.kUp5BlJNzMxcGVg3lvOo7cyQvQ4znHbGjH3FwumETd0"
ENV SUPABASE_SECRET_KEY="sb_secret_Xo5XelCeUxrfe8qt46lHqw_m78WP_cI"
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
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODA4MDMsImV4cCI6MjA5NDM1NjgwM30.6vPjV-m8a2Ag9DCNv8b95dxeIG2GkKGrRj6PI7fWt4Y"
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_kvWfyUSg_SihO3Mnp93TKw_AJVntAiU"
ENV SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4MDgwMywiZXhwIjoyMDk0MzU2ODAzfQ.kUp5BlJNzMxcGVg3lvOo7cyQvQ4znHbGjH3FwumETd0"
ENV SUPABASE_SECRET_KEY="sb_secret_Xo5XelCeUxrfe8qt46lHqw_m78WP_cI"
ENV AWS_REGION="us-east-1"
ENV AWS_ACCESS_KEY_ID="AKIA3CLIMM6P7BBAI5PC"
ENV AWS_SECRET_ACCESS_KEY="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"
ENV AWS_ASSET_BUCKET="remotionlambda-useast1-2zq6twaok1"
ENV AWS_ASSET_REGION="us-east-1"
ENV REMOTION_AWS_REGION="us-east-1"
ENV REMOTION_BUCKET_NAME="remotionlambda-useast1-2zq6twaok1"
ENV REMOTION_LAMBDA_BUCKET_NAME="remotionlambda-useast1-2zq6twaok1"
ENV REMOTION_LAMBDA_SITE_NAME="itnavideo-render-30fps"
ENV REMOTION_LAMBDA_FUNCTION_NAME="remotion-render-4-0-467-mem3008mb-disk2048mb-900sec"
ENV REMOTION_LAMBDA_SERVE_URL="https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html"
ENV GROQ_API_KEY="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"
ENV GEMINI_API_KEY="AIzaSyCR9-efUMpo2psDvDU8EPIksTyETam8EE8"
ENV RAZORPAY_KEY_ID="rzp_live_TDIcPcfQ6jFu3F"
ENV RAZORPAY_KEY_SECRET="D5cyRI6gQnUX7FHOLCt5Q9fG"
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_TDIcPcfQ6jFu3F"
ENV CLOUDINARY_CLOUD_NAME="dhouh9idx"
ENV CLOUDINARY_API_KEY="972395946869552"
ENV CLOUDINARY_API_SECRET="wSwqFlvlj0DhvMA5yEXyjlt8uMo"
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dhouh9idx"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
