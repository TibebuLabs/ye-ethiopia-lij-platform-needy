# Ye Ethiopia Lij — Setup Guide

## Required Software

Install these before starting:

| Software | Version | Download |
|---|---|---|
| Python | 3.12 | https://python.org |
| Node.js | 22.19 | https://nodejs.org |
| MongoDB | 7.0+ | https://www.mongodb.com/try/download/community |
| Git | latest | https://git-scm.com |

---

## Step 1 — Clone the Project

```bash
git clone  github repo== if u  want to clone from github
cd project folder
```

---

## Step 2 — Start MongoDB

Make sure MongoDB is running on your machine.

**Windows:** MongoDB runs as a service automatically after install.
Check it is running:
```bash
mongosh
```
You should see a `>` prompt. Type `exit` to quit.

---

## Step 3 — Backend Setup

### 3.1 Create virtual environment

```bash
cd Ye_Ethiopia_lij_back/Ye_Ethiopia_lij
python -m venv venv
```

### 3.2 Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```


```bash
source venv/bin/activate
```

### 3.3 Install dependencies

```bash
pip install -r requirements.txt
```

### 3.4 Create the .env file

Copy the example file:
```bash


Open `.env` and fill in:

```env
SECRET_KEY=any-long-random-string-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

MONGO_DB_NAME=ye_ethiopia_lij_db
MONGO_HOST=localhost
MONGO_PORT=27017

FRONTEND_URL=http://localhost:3000
```

Leave email settings as console backend for now (see Step 6 for real email).

### 3.5 Run migrations

```bash
python manage.py migrate
```

### 3.6 Start the backend server

```bash
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

## Step 4 — Frontend Setup

Open a **new terminal window**.

### 4.1 Go to frontend folder

```bash
cd ye-ethiopia-lij-frontend
```

### 4.2 Install dependencies

```bash
npm install
```

### 4.3 Create frontend .env file

Create a file called `.env` in the `ye-ethiopia-lij-frontend` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4.4 Start the frontend

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Step 5 — Create First Admin Account

Open your browser and go to: **http://localhost:3000/register**

Register with role **ADMIN**. The first admin account is created automatically as active.

---

## Step 6 — Email Setup (Password Reset)

To send real password reset emails, you need a Gmail App Password.

### 6.1 Create Gmail App Password

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords** → select "Mail" → generate
4. Copy the 16-character password shown

### 6.2 Update .env

Open `Ye_Ethiopia_lij_back/Ye_Ethiopia_lij/.env` and update:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
DEFAULT_FROM_EMAIL=your-gmail@gmail.com
```

Restart the backend after saving.

> **Testing without email:** Keep `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`
> The reset link will print in the terminal instead of being emailed.

---

## Quick Reference

| What | Command | URL |
|---|---|---|
| Start backend | `python manage.py runserver` | http://localhost:8000 |
| Start frontend | `npm run dev` | http://localhost:3000 |
| API docs | — | http://localhost:8000/api/schema/swagger-ui/ |

---

## Troubleshooting

**MongoDB not connecting** — Make sure MongoDB service is running.

**Port already in use** — Change port: `python manage.py runserver 8001`

**npm install fails** — Make sure Node.js 18+ is installed: `node --version`

**Migrations fail** — Make sure MongoDB is running and `.env` has correct `MONGO_HOST`.
