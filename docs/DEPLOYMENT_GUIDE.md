# Itnavideo — Complete Deployment Guide

> **Single Source of Truth for Deployments**  
> Use this guide to deploy Itnavideo's Web Application (Google Cloud Run) and Rendering Engine (AWS Remotion Lambda).

---

## 🏗️ 2-Tier Cloud Architecture

| Tier | Component | Hosted On | Deployment Command | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Web Application & APIs** | **Google Cloud Run** | `npm run deploy` | Next.js frontend, dashboard studios, `/api/*` routes |
| **Tier 2** | **Video Rendering Engine** | **AWS Remotion Lambda** | `npm run reel:lambda:deploy` | Remotion composition bundles, S3 render assets, Lambda workers |

---

## 1. Web App Deployment (Google Cloud Run)

### When to deploy:
- Changes in Next.js pages, UI components, dashboard studios (`components/dashboard/*`).
- Changes in backend API routes (`app/api/*`) or server actions.
- Styling, layout, or copy changes.

### Step 1: Pre-requisite Authentication (One-time or when token expires)
If the Google Cloud auth token is expired, open your terminal (PowerShell / Command Prompt) and run:
```bash
gcloud auth login
```
*(Your browser will open to log in with your Google account `rohi@itnavideo.com`)*

### Step 2: Run Deployment
```bash
npm run deploy
```
*(Or run directly: `powershell -ExecutionPolicy Bypass -File .\deploy.ps1`)*

- **Target Service**: `itnavideo-web` (`us-central1`)
- **GCP Project**: `geometric-hull-501707-m2`
- **Live URL**: `https://www.itnavideo.com`

---

## 2. Remotion Video Engine Deployment (AWS Lambda)

### When to deploy:
- Changes in Remotion templates (`remotion/templates/*`).
- Changes in Remotion composition registry (`remotion/index.tsx`).
- Changes in subtitle styling / caption render logic (`remotion/utils/*`, `remotion/types/*`).

### Command:
```bash
npm run reel:lambda:deploy
```

- **Target**: AWS Lambda (`us-east-1`)
- **Site Bundle**: AWS S3 (`remotionlambda-*`)
- **Site Name**: `itnavideo-render-30fps`

---

## 3. Reusable Assets Indexing

### When to run:
- Whenever new stock images, stickers, sound effects, or music files are added to `public/assets/`.

### Command:
```bash
npm run assets:index
```

---

## ⚠️ Common Deployment Troubleshooting

| Issue / Error | Cause | Fix |
| :--- | :--- | :--- |
| `Reauthentication failed. cannot prompt during non-interactive execution` | `gcloud` OAuth token expired. | Run `gcloud auth login` interactively in terminal. |
| `Video type not available in production render` | Remotion template updated locally but AWS Lambda bundle not deployed. | Run `npm run reel:lambda:deploy`. |
| `Deploy FAILED on Cloud Run` | Type error or build break. | Run `npx tsc --noEmit` locally first to verify zero errors. |
