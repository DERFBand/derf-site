# D.E.R.F. — Official Website (Fullstack Platform)

A production-grade fullstack platform for the official website of the band D.E.R.F.

This project includes a high-performance backend (FastAPI), a modern frontend (Next.js), PostgreSQL database, real-time features, and a fully localized content system.

---

## 🚀 Features

* 🌍 Full internationalization (i18n, database-driven)
* 📰 News and announcements
* 🎵 Music releases and discography
* 📅 Concerts and events
* 🖼 Media gallery (photos & videos)
* 💬 Real-time chat (WebSocket)
* 🧵 Forum / discussions
* 👤 User accounts and profiles
* 🔐 JWT-based authentication
* 📂 Local file storage (no S3 dependency)
* ⚡ Fully asynchronous backend

---

## 🏗 Architecture

```
Next.js (Frontend)
        ↓
FastAPI (Backend)
        ↓
PostgreSQL + Redis
        ↓
Local File Storage (/srv/derf_media)
```

---

## 📦 Tech Stack

### Backend

* FastAPI
* SQLModel
* PostgreSQL (asyncpg)
* Redis
* Pydantic
* WebSockets

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Query
* Zustand

### Infrastructure

* Nginx
* systemd
* Certbot (Let's Encrypt SSL)

---

## ⚙️ Deployment (VPS, No Docker)

### 1. Install system dependencies

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql redis-server nginx
```

---

### 2. Configure PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE derf;
CREATE USER derf_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE derf TO derf_user;
```

---

### 3. Backend setup

```bash
cd /srv
git clone <repository>
cd derf-backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env`:

```env
DATABASE_URL=postgresql+asyncpg://derf_user:password@localhost:5432/derf
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=change_this_value
MEDIA_ROOT=/srv/derf_media
```

Create media directory:

```bash
mkdir -p /srv/derf_media
chown -R deploy:deploy /srv/derf_media
```

Run:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

### 4. systemd service

`/etc/systemd/system/derf.service`

```ini
[Unit]
Description=D.E.R.F. Backend
After=network.target

[Service]
User=deploy
WorkingDirectory=/srv/derf-backend
ExecStart=/srv/derf-backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable derf
sudo systemctl start derf
```

---

### 5. Nginx configuration

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN;

    location /media/ {
        alias /srv/derf_media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

---

### 6. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d YOUR_DOMAIN
```

---

## 📡 API Overview

### Authentication

* `POST /api/v1/auth/login`
* `POST /api/v1/auth/register`

### Content

* `GET /api/v1/news`
* `GET /api/v1/events`
* `GET /api/v1/media`

### Uploads

* `POST /api/v1/media/upload`

### Real-time Chat

* `WS /ws/chat`

---

## 📂 Media Storage

All uploaded files are stored locally:

```
/srv/derf_media
```

Accessible via:

```
/media/<filename>
```

---

## 🧠 Architectural Notes

* All content is localization-ready (translations stored in DB)
* Backend acts as a headless CMS
* WebSocket layer supports horizontal scaling via Redis
* Media files can be post-processed (thumbnails, compression)

---

## 🔒 Security Considerations

* JWT authentication
* File upload validation and sanitization
* Reverse proxy isolation (Nginx)
* Recommended: rate limiting & request validation

---

## 📈 Scaling Strategy

* Add CDN for static/media content
* Move Redis to a dedicated instance
* Run multiple backend workers behind Nginx

---

## 🛠 Roadmap

* Admin panel (content management UI)
* Notification system
* Email integration
* SEO optimization

---

## 📄 License

Private / Internal Use
