@echo off
REM Ye Ethiopia Lij - Quick Start Script for Windows

echo ================================
echo Ye Ethiopia Lij - Quick Start
echo ================================
echo.

REM Check Python version
echo Checking Python version...
python --version
echo.

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo .env file created - please update with your configuration
) else (
    echo .env file already exists
)
echo.

REM Create logs directory
if not exist "logs" (
    echo Creating logs directory...
    mkdir logs
)
echo.

REM Create media directory
if not exist "media" (
    echo Creating media directory...
    mkdir media
)
echo.

REM Run migrations
echo Running migrations...
python manage.py migrate
echo Migrations completed
echo.

REM Create superuser
echo Creating superuser...
echo Please enter superuser details:
python manage.py createsuperuser
echo.

REM Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput
echo Static files collected
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Update .env file with your configuration
echo 2. Start MongoDB: mongod
echo 3. Run development server: python manage.py runserver
echo 4. Access API documentation: http://localhost:8000/api/docs/
echo.
pause
