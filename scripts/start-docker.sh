#!/bin/bash
# Quick Start Script for Docker Development

echo "🚀 Starting Tripook with Docker..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Creating from template..."
    cp .env.docker .env
    echo "✅ .env file created. Please edit it with your configurations."
    echo "   Then run this script again."
    echo ""
    exit 0
fi

# Check Docker
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not running!"
    echo "   Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    exit 1
fi

docker --version
docker-compose --version
echo "✅ Docker is ready!"
echo ""

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down
echo ""

# Build and start services
echo "Building and starting services..."
echo "This may take a few minutes on first run..."
echo ""
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All services are starting up!"
    echo ""
    echo "📋 Service URLs:"
    echo "   Frontend:  http://localhost"
    echo "   Backend:   http://localhost:5000/api"
    echo "   MongoDB:   mongodb://localhost:27017"
    echo ""
    echo "📊 To view logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 To stop services:"
    echo "   docker-compose down"
    echo ""
    
    # Wait a bit and show status
    sleep 5
    echo "Current container status:"
    docker-compose ps
else
    echo ""
    echo "❌ Failed to start services!"
    echo "   Check logs with: docker-compose logs"
    exit 1
fi
