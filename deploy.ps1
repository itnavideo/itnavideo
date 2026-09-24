# 1-Click Production Deployment for Itnavideo to Google Cloud Run (USA us-central1)
Write-Output "========================================"
Write-Output "🚀 Starting Production Deployment to Google Cloud Run (us-central1)..."
Write-Output "========================================"

& "C:\Users\user\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" run deploy itnavideo-web --region us-central1 --project itnavideo-60687 --source . --clear-base-image --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Output "========================================"
    Write-Output "✅ Google Cloud Run Production Deployment SUCCESSFUL!"
    Write-Output "🌐 Primary Domain: https://www.itnavideo.com"
    Write-Output "🎨 Studio URL:     https://www.itnavideo.com/dashboard/image-to-video"
    Write-Output "☁️ Direct URL:     https://itnavideo-web-804848668830.us-central1.run.app"
    Write-Output "========================================"
} else {
    Write-Error "❌ Google Cloud Run Deployment Failed!"
    exit $LASTEXITCODE
}

