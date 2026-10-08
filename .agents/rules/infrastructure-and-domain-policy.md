# ITNAVIDEO Infrastructure & Domain Architecture

This document defines the permanent hosting, cloud infrastructure, and domain routing rules for **Itnavideo**. All developers and AI agents must strictly follow these rules.

---

## 1. Primary Domain & SEO Canonical
- **Primary Domain**: `https://www.itnavideo.com`
- **Apex Domain (itnavideo.com)**: Must **always 301 permanently redirect** to `https://www.itnavideo.com`.
- **Reason**: 100+ SEO blog articles, Google Instant Indexing API, Bing IndexNow, Search Console properties, and sitemaps are registered under `www.itnavideo.com`. Canonical must never be switched away from `www`.

---

## 2. Cloud Hosting & Region
- **Provider**: Google Cloud Run (Fully Managed Container)
- **Project ID**: `geometric-hull-501707-m2`
- **Service Name**: `itnavideo-web`
- **Region**: `us-central1` (Iowa, USA)
- **Target Audience**: USA creators and global English audience.
- **Startup Credits**: $2,000 active Google Cloud startup credits.
- **Vercel Status**: **Permanently Cancelled / Deprecated**. Never deploy to or configure Vercel.

---

## 3. Storage & Media Assets
- **Provider**: Google Cloud Storage (GCS)
- **Bucket**: `itnavideo-media-assets`
- **Cloudinary Status**: **Permanently Deprecated**. Cloudinary 100MB free caps and timeout limits are bypassed by streaming and rendering directly through GCS.

---

## 4. Production Deployment Command

To deploy the latest code to Google Cloud Run:
```bash
gcloud run deploy itnavideo-web --region us-central1 --project geometric-hull-501707-m2 --source . --quiet
```
Or via PowerShell:
```powershell
.\deploy.ps1
```
