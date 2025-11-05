#!/bin/bash

# GAM Configuration Manager - Setup Script
# This script will help you set up the entire application

set -e

echo "=========================================="
echo "GAM Configuration Manager - Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "README.md" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} Python 3 found: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python 3 not found. Please install Python 3.9 or higher"
    exit 1
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18 or higher"
    exit 1
fi

# Check PostgreSQL
if command_exists psql; then
    POSTGRES_VERSION=$(psql --version | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} PostgreSQL found: $POSTGRES_VERSION"
else
    echo -e "${YELLOW}⚠${NC}  PostgreSQL client not found. Make sure PostgreSQL is installed and accessible"
fi

# Check GAM
if command_exists gam; then
    GAM_VERSION=$(gam version | head -n 1)
    echo -e "${GREEN}✓${NC} GAM found: $GAM_VERSION"
    GAM_PATH=$(which gam)
else
    echo -e "${YELLOW}⚠${NC}  GAM not found. You'll need to install GAM separately"
    GAM_PATH="/usr/local/bin/gam"
fi

echo ""
echo "=========================================="
echo "Setting up Backend"
echo "=========================================="
echo ""

# Backend setup
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${GREEN}✓${NC} Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓${NC} Python dependencies installed"

# Create .env file
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gam_config_manager

# API
API_V1_STR=/api/v1
PROJECT_NAME=GAM Configuration Manager
DEBUG=True

# Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# GAM
GAM_PATH=$GAM_PATH
GAM_CONFIG_DIR=$HOME/GAMConfig
GAM_DOMAIN=yourdomain.com
EOF
    echo -e "${GREEN}✓${NC} Backend .env file created"
    echo -e "${YELLOW}⚠${NC}  Please edit backend/.env to configure your database and GAM settings"
else
    echo -e "${GREEN}✓${NC} Backend .env file already exists"
fi

cd ..

echo ""
echo "=========================================="
echo "Setting up Frontend"
echo "=========================================="
echo ""

# Frontend setup
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install --silent
echo -e "${GREEN}✓${NC} Node.js dependencies installed"

# Create .env file
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✓${NC} Frontend .env file created"
else
    echo -e "${GREEN}✓${NC} Frontend .env file already exists"
fi

cd ..

echo ""
echo "=========================================="
echo "Database Setup"
echo "=========================================="
echo ""

# Ask if user wants to create database
read -p "Do you want to create the PostgreSQL database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: gam_config_manager): " DB_NAME
    DB_NAME=${DB_NAME:-gam_config_manager}
    
    read -p "Enter database user (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    echo "Creating database..."
    createdb -U $DB_USER $DB_NAME 2>/dev/null && echo -e "${GREEN}✓${NC} Database created" || echo -e "${YELLOW}⚠${NC}  Database might already exist"
    
    echo "Initializing database tables..."
    cd backend
    source venv/bin/activate
    python -m app.db.init_db
    cd ..
    echo -e "${GREEN}✓${NC} Database initialized"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python -m app.main"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5173"
echo ""
echo "For more information, see:"
echo "  - README.md - General overview"
echo "  - SETUP.md - Detailed setup instructions"
echo "  - FEATURES.md - Feature documentation"
echo "  - API_DOCUMENTATION.md - API reference"
echo ""
echo -e "${GREEN}Happy configuring!${NC}"

