#!/bin/bash

# Ye Ethiopia Lij - Quick Start Script
# This script sets up the development environment

set -e

echo "================================"
echo "Ye Ethiopia Lij - Quick Start"
echo "================================"
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"
echo ""

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
    echo "Virtual environment created"
else
    echo "Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "Virtual environment activated"
echo ""

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ".env file created - please update with your configuration"
else
    echo ".env file already exists"
fi
echo ""

# Create logs directory
if [ ! -d "logs" ]; then
    echo "Creating logs directory..."
    mkdir -p logs
fi
echo ""

# Create media directory
if [ ! -d "media" ]; then
    echo "Creating media directory..."
    mkdir -p media
fi
echo ""

# Run migrations
echo "Running migrations..."
python manage.py migrate
echo "Migrations completed"
echo ""

# Create superuser
echo "Creating superuser..."
echo "Please enter superuser details:"
python manage.py createsuperuser
echo ""

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput
echo "Static files collected"
echo ""

echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start MongoDB: mongod"
echo "3. Run development server: python manage.py runserver"
echo "4. Access API documentation: http://localhost:8000/api/docs/"
echo ""
