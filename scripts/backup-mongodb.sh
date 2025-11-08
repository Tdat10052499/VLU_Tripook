#!/bin/bash
# MongoDB Backup Script for Tripook

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="tripook_backup_${TIMESTAMP}"
CONTAINER_NAME="tripook-mongodb"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting MongoDB backup...${NC}"

# Create backup directory if not exists
mkdir -p ${BACKUP_DIR}

# Run mongodump in container
docker-compose exec -T mongodb mongodump \
    --username="${MONGO_ROOT_USERNAME:-admin}" \
    --password="${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase=admin \
    --db="${MONGO_DATABASE:-tripook}" \
    --out="/backups/${BACKUP_NAME}"

if [ $? -eq 0 ]; then
    # Copy backup from container to host
    docker cp ${CONTAINER_NAME}:/backups/${BACKUP_NAME} ${BACKUP_DIR}/
    
    # Compress backup
    cd ${BACKUP_DIR}
    tar -czf ${BACKUP_NAME}.tar.gz ${BACKUP_NAME}
    rm -rf ${BACKUP_NAME}
    
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo -e "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    
    # Clean up old backups (keep last 7 days)
    find ${BACKUP_DIR} -name "tripook_backup_*.tar.gz" -mtime +7 -delete
    echo -e "${YELLOW}Old backups cleaned up (kept last 7 days)${NC}"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi
