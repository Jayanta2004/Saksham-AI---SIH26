# SAKSHAM AI — Comprehensive Production Deployment Guide 🚀
**Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026**

This guide provides end-to-end instructions for deploying the **Saksham AI Platform**, covering all components:
1. **Frontend:** React (Vite, Tailwind CSS, Recharts)
2. **API Gateway:** Node.js, Express, JWT, Redis Cache
3. **AI & RAG Engine:** Python 3.11, FastAPI, Uvicorn, LangChain, SentenceTransformers
4. **Database:** PostgreSQL 16 (Relational schemas, Competency Matrices)
5. **Cache / Sessions:** Redis 7 (In-memory caching, Rate-limiting, OTP resets)

---

## 📋 Architecture Overview

```
                      ┌──────────────────────────────┐
                      │    Cloudflare / Nginx SSL    │ (Port 443 / 80)
                      └──────────────┬───────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
        ┌────────▼────────┐                     ┌────────▼────────┐
        │  Vite Frontend  │ (Port 3000)         │   API Gateway   │ (Port 5000)
        │ (Static / Nginx)│                     │ (Node.js/Express│
        └─────────────────┘                     └────────┬────────┘
                                                         │
                               ┌─────────────────────────┼─────────────────────────┐
                               │                         │                         │
                      ┌────────▼────────┐       ┌────────▼────────┐       ┌────────▼────────┐
                      │ Python AI / RAG │       │  PostgreSQL 16  │       │     Redis 7     │
                      │  FastAPI (:8000)│       │ Database (:5432)│       │  Cache (:6379)  │
                      └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 🐳 Option 1: Docker Compose Deployment (Recommended)
*Ideal for single Linux VPS (Ubuntu/Debian on AWS EC2, DigitalOcean, Hetzner, Linode, or On-Premises Government VM).*

### Step 1: Install Docker & Docker Compose on the Server
```bash
# Ubuntu / Debian
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git

# Enable Docker service
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### Step 2: Clone the Repository
```bash
git clone https://github.com/Jayanta2004/Saksham-AI---SIH26.git
cd Saksham-AI---SIH26
```

### Step 3: Configure Production Environment Variables
Create a root `.env` file:
```bash
cp backend/gateway_service/.env.example backend/gateway_service/.env
```
Ensure the following variables are configured:
```env
# AI Service Keys
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Gateway Secrets
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long_2026
DATA_ENCRYPTION_KEY=secure_32_char_encryption_key!!
POSTGRES_PASSWORD=SakshamPostgresPassword2026!
```

### Step 4: Build and Start All Microservices
```bash
docker compose up --build -d
```

### Step 5: Verify Running Containers
```bash
docker compose ps
```
You should see all 5 containers in an **Up (healthy)** state:
- `saksham_postgres` (:5432)
- `saksham_redis` (:6379)
- `saksham_ai_service` (:8000)
- `saksham_gateway` (:5000)
- `saksham_frontend` (:3000)

### Step 6: View Service Logs
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f gateway_service
docker compose logs -f ai_service
```

---

## ☁️ Option 2: Managed Cloud Deployment (Vercel + Render / Railway + Supabase)
*Ideal for zero-server-management, free-tier setups, and live client presentations.*

### 1. Database & Cache
1. **PostgreSQL:** Create a free project at [Supabase](https://supabase.com) or [Neon](https://neon.tech).
   - In the SQL editor, run the schema and seed scripts:
     - [`backend/gateway_service/src/db/schema.sql`](backend/gateway_service/src/db/schema.sql)
     - [`backend/gateway_service/src/db/seed.sql`](backend/gateway_service/src/db/seed.sql)
   - Copy the PostgreSQL connection string.
2. **Redis:** Create a free serverless Redis database at [Upstash](https://upstash.com).
   - Copy the `redis://...` URL.

### 2. Python AI Service (Render / Railway)
- **Repo Root:** `./backend/ai_service`
- **Environment:** Python 3.11
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `PORT=8000`
  - `GEMINI_API_KEY=your_key`
  - `OPENAI_API_KEY=your_key`
- Note your live AI URL: `https://saksham-ai-service.onrender.com`

### 3. Node.js Gateway API (Render / Railway)
- **Repo Root:** `./backend/gateway_service`
- **Environment:** Node.js 20
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- **Environment Variables:**
  - `PORT=5000`
  - `DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require`
  - `REDIS_URL=rediss://default:token@host:6379`
  - `PYTHON_AI_URL=https://saksham-ai-service.onrender.com`
  - `JWT_SECRET=your_long_jwt_secret`
  - `DATA_ENCRYPTION_KEY=your_32_char_key`
- Note your live Gateway URL: `https://saksham-gateway.onrender.com`

### 4. React Frontend (Vercel / Cloudflare Pages)
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL=https://saksham-gateway.onrender.com`
- Configure Rewrite Rule for Single Page Application in `frontend/vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

---

## 🔒 Production Nginx & Domain SSL Setup (VPS)

If deploying to a domain (e.g. `saksham.gov.in` or `saksham.yourdomain.com`) on an Ubuntu VPS, install Nginx and Certbot:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/saksham`:
```nginx
server {
    server_name saksham.yourdomain.com;

    # Frontend Static Assets
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Gateway
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and acquire free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/saksham /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d saksham.yourdomain.com
```

---

## 🛠️ Health & Maintenance Cheatsheet

| Task | Command |
| :--- | :--- |
| **Restart all services** | `docker compose restart` |
| **Rebuild after Git pull** | `git pull && docker compose up --build -d` |
| **Check database health** | `docker exec -it saksham_postgres pg_isready -U postgres` |
| **Test Redis cache** | `docker exec -it saksham_redis redis-cli ping` |
| **Backup PostgreSQL DB** | `docker exec -t saksham_postgres pg_dumpall -c -U postgres > backup_$(date +%F).sql` |
| **Restore PostgreSQL DB** | `cat backup.sql \| docker exec -i saksham_postgres psql -U postgres` |
