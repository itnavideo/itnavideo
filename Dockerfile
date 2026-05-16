FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    fontconfig \
    fonts-dejavu-core \
    python3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=160"
ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV FFMPEG_THREADS=1
ENV LOW_MEMORY_RENDER=1
ENV LOW_MEMORY_FPS=24
ENV LOW_MEMORY_AUDIO_BITRATE=96k
ENV LOW_MEMORY_STATIC_CRF=30
ENV LOW_MEMORY_MOTION_CRF=26
ENV LOW_MEMORY_FFMPEG_PRESET=ultrafast
ENV MVP_TYPOGRAPHY_RENDER=1

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 10000

CMD ["node", "--optimize_for_size", "--max-old-space-size=160", "render-worker/server.mjs"]
