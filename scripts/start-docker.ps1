# Quick Start Script for Docker Development
# Run this script to start all services

Write-Host "🚀 Starting Tripook with Docker..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found! Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.docker" ".env"
    Write-Host "✅ .env file created. Please edit it with your configurations." -ForegroundColor Green
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# Check Docker
Write-Host "Checking Docker installation..." -ForegroundColor Cyan
docker --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not installed or not running!" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

docker-compose --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Compose is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is ready!" -ForegroundColor Green
Write-Host ""

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Cyan
docker-compose down
Write-Host ""

# Build and start services
Write-Host "Building and starting services..." -ForegroundColor Cyan
Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
Write-Host ""
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All services are starting up!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Service URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:5000/api" -ForegroundColor White
    Write-Host "   MongoDB:   mongodb://localhost:27017" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 To view logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop services:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    
    # Wait a bit and show status
    Start-Sleep -Seconds 5
    Write-Host "Current container status:" -ForegroundColor Cyan
    docker-compose ps
} else {
    Write-Host ""
    Write-Host "❌ Failed to start services!" -ForegroundColor Red
    Write-Host "   Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
