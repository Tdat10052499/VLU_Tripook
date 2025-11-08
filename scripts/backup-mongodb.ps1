# MongoDB Backup Script for Tripook (Windows PowerShell)

# Configuration
$BACKUP_DIR = ".\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_NAME = "tripook_backup_$TIMESTAMP"
$CONTAINER_NAME = "tripook-mongodb"

# Load environment variables from .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^#].+?)=(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$MONGO_USERNAME = $env:MONGO_ROOT_USERNAME
if ([string]::IsNullOrEmpty($MONGO_USERNAME)) { $MONGO_USERNAME = "admin" }
$MONGO_PASSWORD = $env:MONGO_ROOT_PASSWORD
$MONGO_DATABASE = $env:MONGO_DATABASE
if ([string]::IsNullOrEmpty($MONGO_DATABASE)) { $MONGO_DATABASE = "tripook" }

Write-Host "Starting MongoDB backup..." -ForegroundColor Yellow

# Create backup directory if not exists
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Run mongodump in container
Write-Host "Creating backup in container..." -ForegroundColor Cyan
docker-compose exec -T mongodb mongodump `
    --username="$MONGO_USERNAME" `
    --password="$MONGO_PASSWORD" `
    --authenticationDatabase=admin `
    --db="$MONGO_DATABASE" `
    --out="/backups/$BACKUP_NAME"

if ($LASTEXITCODE -eq 0) {
    # Copy backup from container to host
    Write-Host "Copying backup to host..." -ForegroundColor Cyan
    docker cp "${CONTAINER_NAME}:/backups/$BACKUP_NAME" "$BACKUP_DIR/"
    
    # Compress backup
    Write-Host "Compressing backup..." -ForegroundColor Cyan
    Compress-Archive -Path "$BACKUP_DIR\$BACKUP_NAME" -DestinationPath "$BACKUP_DIR\$BACKUP_NAME.zip" -Force
    Remove-Item -Recurse -Force "$BACKUP_DIR\$BACKUP_NAME"
    
    Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
    Write-Host "Backup file: $BACKUP_DIR\$BACKUP_NAME.zip" -ForegroundColor Green
    
    # Clean up old backups (keep last 7 days)
    Write-Host "Cleaning up old backups..." -ForegroundColor Yellow
    $cutoffDate = (Get-Date).AddDays(-7)
    Get-ChildItem -Path $BACKUP_DIR -Filter "tripook_backup_*.zip" | 
        Where-Object { $_.LastWriteTime -lt $cutoffDate } | 
        Remove-Item -Force
    Write-Host "Old backups cleaned up (kept last 7 days)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Backup failed!" -ForegroundColor Red
    exit 1
}
