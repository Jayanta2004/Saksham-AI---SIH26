# SAKSHAM AI — Skill Intelligence & Learning Platform
### *AI-Enabled Competency Assessment, Skill-Gap Analytics & Personalized Training Engine for India's Official Statistical System*
#### **Smart India Hackathon 2026 | Problem Statement ID: 26101 | Ministry of Statistics & Programme Implementation (MoSPI)**

[![Platform](https://img.shields.io/badge/Platform-Saksham%20AI-blue.svg)](#)
[![Organization](https://img.shields.io/badge/Organization-MoSPI%20%2F%20DIID-orange.svg)](https://mospi.gov.in)
[![FastAPI Docs](https://img.shields.io/badge/Swagger%20UI-FastAPI%20%7C%20Port%208000-009688.svg)](http://127.0.0.1:8000/docs)
[![API Gateway](https://img.shields.io/badge/API%20Gateway-Express%20%7C%20Port%205000-339933.svg)](http://localhost:5000/health)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Port%203000-61DAFB.svg)](http://localhost:3000)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Active-4169E1.svg)](#)
[![Security](https://img.shields.io/badge/Security-AES--256%20%7C%20DPDPA%202023-red.svg)](#)
[![Integration](https://img.shields.io/badge/Integration-iGOT%20Karmayogi%20%2B%20NSSTA-blueviolet.svg)](#)
[![Credentials](https://img.shields.io/badge/Standards-W3C%20Verifiable%20Credentials%202.0-success.svg)](#)

---

## 1. Executive Summary & Problem Statement

India's statistical system is undergoing a massive transformation with the integration of modern digital workflows, Big Data analytics, AI/ML models, Computer Assisted Personal Interviewing (CAPI), and administrative data integration. Statistical personnel across the **Ministry of Statistics & Programme Implementation (MoSPI)**, **Central Statistics Office (CSO)**, **National Sample Survey Office (NSSO)**, and **National Statistical Systems Training Academy (NSSTA)** require continuous capability enhancement.

While the **iGOT Karmayogi** platform provides vast e-learning repositories, statistical personnel encounter major friction in discovering courses mapped to their specific cadre hierarchy, job descriptions, and actual mathematical skill gaps.

**Saksham AI** bridges this gap by delivering a **Unified AI-Powered Skill Intelligence and Learning Platform** tailored specifically for India's Official Statistical Cadres (*Indian Statistical Service - ISS, Subordinate Statistical Service - SSS*).

### Institutional Metadata
* **Problem Statement ID:** 26101 (Smart India Hackathon 2026)
* **Ministry / Nodal Body:** Ministry of Statistics & Programme Implementation (MoSPI), Govt. of India
* **Implementing Divisions:** Data Informatics & Innovation Division (DIID) & NSSTA Greater Noida
* **Theme & Category:** Smart Education | Software Prototype
* **Target Ecosystems:** `mospi.gov.in`, `nssta.gov.in`, `iGOT Karmayogi`, `TPAC Training Calendar`

---

## 2. Key Platform Capabilities

| Capability | Technical Description | Strategic Objective |
| :--- | :--- | :--- |
| **AI Competency Profiling** | Evaluates baseline proficiency across official statistical standards (*Survey Sampling, SNA 2008 National Accounts, Python/R Analytics, DPDPA 2023*). | *Automated Competency Framework Mapping* |
| **Mathematical Skill-Gap Engine** | Computes multi-dimensional capability deficits ($\Delta = Benchmark - Current$) and renders interactive Recharts Radar Charts. | *Automated Skill-Gap Analysis* |
| **Dual iGOT & NSSTA Sync** | Bi-directional API connectors synchronizing e-learning modules from **iGOT Karmayogi** and in-person residential workshops from **NSSTA Greater Noida**. | *Seamless iGOT & NSSTA Integration* |
| **RAG Assessment & MCQ Generator** | Parses uploaded PDFs/training manuals using PyMuPDF to synthesize 4-option MCQs with difficulty tags, rationale, and official manual citations. | *AI-Powered Assessment Engine* |
| **Multilingual Voice Statistical Copilot** | Domain chatbot grounded in official guidelines supporting **8 Indian languages + English**, with full Web Speech Speech-to-Text (STT) and Text-to-Speech (TTS). | *Real-Time Learner Support & Bhashini* |
| **In-Browser Statistical Sandbox** | WebAssembly Python execution environment (Pyodide) enabling officers to run live calculations (Gini Coefficient, Laspeyres CPI, Stratified Sampling) directly in the browser. | *Hands-On Exercises & Virtual Labs* |
| **CAPI Survey Enumerator Simulator** | AI-powered field enumeration simulator for PLFS, HCES, and ASI surveys with simulated household respondents and enumerator probing audits. | *Hands-On Field Capability Building* |
| **Cadre Leaderboard & Sprints** | Gamified nationwide peer benchmarking across ISS and SSS cadres with National Statistical Sprints, divisional readiness indices, and verified badges. | *Continuous Motivation & Peer Benchmarking* |
| **MoSPI TNA & Deputation Matcher** | Multi-factor mission matching engine for statistical taskforces (SNA 2008, HCES), scheduling NSSTA bridging bootcamps and generating official MoSPI Office Memorandums. | *Data-Driven HR & Capacity Planning* |
| **Public W3C Verifiable Credentials** | Public verification portal (`/verify/:id`) implementing cryptographic SHA-256 / ECDSA proof verification, JSON-LD context, and tamper seals. | *Skill Credentialing & Verification* |
| **Interactive Geo-Statistical Map (GIS / Bhuvan)** | Interactive choropleth map across 6 geographical zones and 36 States/UTs tracking CAPI tablet adoption, NSSO RO/SRO staffing, and dispatching rapid training missions. | *Spatial Capability Intelligence & Regional Governance* |
| **Automated Policy Brief Synthesizer** | Generates official Government of India statistical press releases and cabinet briefs from GDP, CPI, PLFS, and IIP microdata indicators in minutes. | *Executive Reporting & Policy Advisory* |
| **Differential-Privacy Synthetic Data Studio** | Laplace differential-privacy ($\epsilon \in [0.1, 2.0]$) microdata generator for HCES, PLFS, and ASI surveys compliant with DPDPA 2023 with 1-click sandbox injection. | *Privacy-Preserving Statistical Training* |
| **Adaptive CAT / 2PL IRT Testing Engine** | Computerized Adaptive Testing using 2-Parameter Logistic Item Response Theory with real-time Fisher information maximization and latent ability ($\theta$) trajectory plotting. | *Precise Latent Competency Calibration* |
| **NSSTA AI Voice Roleplay Examiner** | Voice-driven oral defense simulator with Web Speech STT/TTS mirroring residential NSSTA viva examinations across Probationary ISS, FOD Supervisory, and National Accounts boards. | *Rigorous Oral Evaluation & Viva Defense* |

---

## 3. MoSPI Official Competency Framework

```
                                    ┌──────────────────────────────────────────────┐
                                    │    MoSPI Official Competency Framework       │
                                    └──────────────────────┬───────────────────────┘
                                                           │
         ┌─────────────────────────┬───────────────────────┴───────────────────────┬─────────────────────────┐
         ▼                         ▼                                               ▼                         ▼
┌───────────────────┐    ┌───────────────────┐                           ┌───────────────────┐     ┌───────────────────┐
│ Statistical (1.0) │    │  Technical (1.0)  │                           │ Digital Gov (0.9) │     │ Leadership (0.85) │
├───────────────────┤    ├───────────────────┤                           ├───────────────────┤     ├───────────────────┤
│ • Survey Sampling │    │ • Python & R Dev  │                           │ • DPDPA 2023      │     │ • Policy Advisory │
│ • SNA 2008 (GDP)  │    │ • AI in Microdata │                           │ • Confidentiality │     │ • Inter-Agency    │
│ • CPI / WPI Index │    │ • CAPI & Big Data │                           │ • Open Data Dissem│     │ • Survey Direction│
│ • Agricultural St │    │ • Stata, SPSS, SQL│                           │ • Govt Cloud Sec  │     │ • Change Mgmt     │
└───────────────────┘    └───────────────────┘                           └───────────────────┘     └───────────────────┘
```

---

## 4. System Architecture

```mermaid
graph TD
    subgraph UI ["1. Presentation Layer (Vite React 18 + Tailwind CSS - Port 3000)"]
        LearnerPortal["Learner Portal (Dashboard, Radar, Pathways, Quiz Arena, Progress)"]
        AdvancedLabs["Virtual Labs (Python Sandbox, CAPI Simulator, Voice Copilot, Leaderboard)"]
        Phase2Labs["Strategic Labs (Geo-Map, Policy Briefs, DPDPA Synthetic Data, CAT IRT Arena, NSSTA Viva)"]
        AdminPortal["Admin Hub (Workforce Analytics, Deputation Matcher, Content Studio)"]
        PublicVerify["Public W3C Verifiable Credential Portal (/verify/:id)"]
    end

    subgraph Gateway ["2. API Gateway & Security Layer (Node.js Express - Port 5000)"]
        JWTAuth["JWT Authentication & RBAC (Learner, Trainer, Sysadmin)"]
        CryptoEngine["AES-256 Field Encryption (PII & National Identifiers)"]
        RedisCache["Redis Hybrid Caching Layer (TTL 3600s)"]
        DeputationEngine["TNA & Cadre Deputation Matcher Engine"]
        Phase2Engines["2PL IRT CAT Engine + Viva Oral Rubric Evaluator + Laplace DP Synthesizer"]
    end

    subgraph AI ["3. AI Intelligence & RAG Engine (Python FastAPI - Port 8000)"]
        DocChunker["Document Chunker (PyMuPDF PDF / DOCX Parser)"]
        MCQGen["RAG MCQ Synthesizer (Citation & Explanation Engine)"]
        GapAnalyzer["Mathematical Competency Graph & Skill-Gap Analyzer"]
        Predictor["12-Month Workforce Predictive Forecasting Engine"]
        LLMChain["Cascading LLM Pipeline (GPT-4o-mini / Gemini / MoSPI Engine)"]
    end

    subgraph Integration ["4. Ecosystem Sync Connectors"]
        iGOTConnector["iGOT Karmayogi Course & Progress Sync API"]
        NSSTAConnector["NSSTA / TPAC Residential Workshop Sync API"]
    end

    subgraph Database ["5. Persistence & Storage Layer"]
        PostgresDB["PostgreSQL Database (SSL Active)"]
        VectorDB["TF-IDF / Vector Store"]
    end

    UI -->|REST / JWT| Gateway
    Gateway -->|Forward AI Requests| AI
    Gateway -->|Sync Catalogues| Integration
    Gateway -->|Persist Records| PostgresDB
    AI -->|Embeddings & Retrieval| VectorDB
```

---

## 5. Repository Directory & Codebase Structure

```
Saksham-AI---SIH26/
├── backend/
│   ├── ai_service/                 # FastAPI AI & RAG Microservice (Port 8000)
│   │   ├── services/
│   │   │   ├── document_parser.py      # PyMuPDF Document Ingestion
│   │   │   ├── quiz_generator.py       # RAG MCQ & Quiz Generator
│   │   │   ├── skill_gap_engine.py     # Competency Matrix & Gap Analyzer
│   │   │   ├── predictive_analytics.py # Workforce Forecasting Model
│   │   │   └── vector_store.py         # Vector Search & Embeddings
│   │   ├── main.py                     # FastAPI Application Router
│   │   └── requirements.txt            # Python Dependencies
│   │
│   └── gateway_service/            # Node.js Express API Gateway (Port 5000)
│       ├── src/
│       │   ├── db/                     # In-Memory & PostgreSQL DB Adapters
│       │   ├── middleware/             # JWT & RBAC Middleware
│       │   ├── services/               # iGOT Sync, NSSTA Sync, Email Service
│       │   ├── utils/                  # AES-256 Encryption & Token Utils
│       │   └── server.js               # Express API Gateway Router
│       └── package.json                # Gateway Dependencies
│
├── frontend/                       # React 18 + Vite + Tailwind CSS SPA (Port 3000)
│   ├── src/
│   │   ├── components/                 # Layout (Header, Sidebar, Main Layout)
│   │   ├── context/                    # Auth, Theme, Language Contexts
│   │   ├── pages/
│   │   │   ├── public/                 # Landing Page, Public W3C Cert Verification
│   │   │   ├── auth/                   # Login, Register, OTP Password Reset
│   │   │   ├── learner/                # Dashboard, Radar, Sandbox, CAPI, Leaderboard, AI Assistant
│   │   │   └── admin/                  # Workforce Intel, Deputation Matcher, RAG Studio, Analytics
│   │   ├── routes/                     # AppRoutes & ProtectedRoute (RBAC)
│   │   └── services/                   # Axios API Client & Offline Feature Store
│   └── package.json                    # Frontend Dependencies
│
├── start_all.bat                   # 1-Click Windows Batch Startup Script
├── start_all.ps1                   # 1-Click PowerShell Startup Script
└── docker-compose.yml              # Containerized Deployment Configuration
```

---

## 6. Pre-Configured Demo Personas

The platform includes 1-click quick login buttons on the `/login` page for easy evaluation:

| Persona | Name & Cadre | Role | Official Email | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| **Learner (SSO)** | **Arjun Sharma, ISS** | `role_learner` | `arjun.sharma@mospi.gov.in` | `Saksham@2026` |
| **Learner (JSO)** | **Priya Deshmukh, SSS** | `role_learner` | `priya.deshmukh@mospi.gov.in` | `Saksham@2026` |
| **Trainer / Faculty**| **Dr. Radhika Sen, ISS** | `role_trainer` | `radhika.sen@nssta.gov.in` | `Saksham@2026` |
| **System Admin / DDG**| **Rajesh K. Verma, ISS** | `role_sysadmin`| `rajesh.verma@mospi.gov.in` | `Saksham@2026` |

*Note: Newly registered users on `/register` are activated immediately with dynamic personalized baseline stats.*

---

## 7. Frontend Routes & Interactive Modules

### Public Routes
* `/` or `/home` — Official MoSPI Saksham AI Landing Page
* `/verify/:credentialId` — **Public W3C Verifiable Credential Portal** with cryptographic SHA-256 seal and JSON-LD context
* `/login`, `/register`, `/forgot-password` — Authentication with 6-digit OTP reset

### Learner Portal Routes
* `/dashboard` — Competency Radar, Top Gaps, Key KPIs, Upcoming Modules
* `/profile` — Official Profile, Cadre Information, Edit Personal Details
* `/skills` — 4-Domain breakdown (*Statistical, Technical, Governance, Behavioural*)
* `/skill-gap` — Mathematical deficit matrix with actionable recommendations
* `/learning-path` — Dynamic milestone roadmap derived from AI gap analysis
* `/courses` & `/courses/:id` — Synchronized iGOT Karmayogi catalog
* `/training` — NSSTA Residential Workshops with live seat tracking & nomination
* `/assessments` & `/quiz/:id` — Diagnostic testing arena with instant grading & feedback
* `/ai-assistant` — **Multilingual Voice Statistical Copilot** (8 Indian languages + English, Web Speech STT/TTS)
* `/playground` — **In-Browser Python Statistical Sandbox** (Pyodide WASM runtime with Gini, CPI, Sampling presets)
* `/capi-simulator` — **AI CAPI Survey & Field Enumeration Simulator** (PLFS, HCES, ASI roleplay interview with scoring)
* `/leaderboard` — **Cadre Leaderboard & National Statistical Sprints** (ISS vs SSS rankings, division matrix, badges)
* `/progress` — Monthly capability trajectory and dynamic learning hours bar charts
* `/certificates` — Verified certificate gallery with modal preview and PDF download

### Administrator & HR Intelligence Routes
* `/admin/dashboard` — Macro workforce readiness KPIs, 4-pillar bar chart, systemic deficits
* `/admin/users` — Employee roster and competency score auditing
* `/admin/competencies` — Official MoSPI benchmark standards framework
* `/admin/deputation` — **Automated MoSPI TNA & Deputation Matcher** (Mission presets, sliders, NSSTA cohort provisioning, official Office Memorandum OM)
* `/admin/content` — RAG Content Studio (Document upload, AI MCQ synthesis, publish live)
* `/admin/analytics` — Division comparison matrix (**NAD, SDRD, FOD, CSO**), risk levels & 12-month predictive forecast
* `/admin/reports` — Exportable audit reports (Workforce Audit PDF, Skill Gap Matrix CSV)
* `/admin/settings` — Recommendation algorithm weights & sync frequency configuration

---

## 8. API Endpoints Catalog

### API Gateway (Node.js Express - Port 5000)

| Category | Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :---: | :--- |
| **Health** | `/health` | `GET` | No | Gateway, database, and AI service health check |
| **Auth** | `/api/auth/login` | `POST` | No | JWT authentication with role authorization |
| **Auth** | `/api/auth/register` | `POST` | No | Self-service registration (Instant auto-activation) |
| **Auth** | `/api/auth/forgot-password`| `POST` | No | Dispatches 6-digit OTP via SMTP |
| **Auth** | `/api/auth/reset-password` | `POST` | No | Validates OTP and updates password |
| **Learner**| `/api/users/competencies` | `GET` | Yes | Live competency scores & radar array |
| **Learner**| `/api/users/stats` | `GET` | Yes | Learning hours, completed courses, quizzes |
| **Learner**| `/api/users/certificates` | `GET` | Yes | List of user certificates with verification IDs |
| **Verify** | `/api/certificates/verify/:id` | `GET` | No | **Public W3C Verifiable Credential validation** |
| **Courses**| `/api/courses` | `GET` | No | Catalog of MoSPI & iGOT courses |
| **Quizzes**| `/api/assessments/quizzes` | `GET` | Yes | Published diagnostic assessments |
| **Quizzes**| `/api/assessments/quiz/:id`| `GET` | Yes | Assessment questions with randomized options |
| **Quizzes**| `/api/assessments/submit` | `POST` | Yes | Auto-grades attempt and updates competencies |
| **Simulator**| `/api/simulator/personas` | `GET` | No | Personas for CAPI field enumeration |
| **Simulator**| `/api/simulator/interact` | `POST` | No | Evaluates enumerator probing response |
| **Rankings**| `/api/rankings/divisions` | `GET` | No | Divisional capability readiness indices |
| **Rankings**| `/api/rankings/cadres` | `GET` | Yes | Nationwide ISS and SSS cadre rankings |
| **Rankings**| `/api/rankings/sprints` | `GET` | Yes | Active National Statistical Sprints |
| **Rankings**| `/api/rankings/join-sprint`| `POST` | Yes | Enrolls officer in a statistical sprint |
| **Admin**  | `/api/admin/deputation/templates` | `GET` | Admin | Mission templates (SNA 2008, HCES, DPDPA) |
| **Admin**  | `/api/admin/deputation/match` | `POST` | Admin | **Multi-factor cadre candidate matching engine** |
| **Admin**  | `/api/admin/deputation/create-cohort` | `POST` | Admin | Commissions bridging training cohort at NSSTA |
| **Admin**  | `/api/admin/workforce-analytics` | `GET` | Admin | Macro workforce readiness & KPIs |
| **Admin**  | `/api/admin/users` | `GET` | Admin | Full officer directory and competency audit |

### Python AI Microservice (FastAPI - Port 8000)

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `GET /health` | `GET` | AI engine health check, RAG status, and LLM availability |
| `POST /api/ai/chat` | `POST` | MoSPI-grounded conversational AI assistant (GPT-4o-mini / Gemini / Fallback) |
| `POST /api/ai/parse-document` | `POST` | Parses training manuals (PDF, DOCX) into text chunks using PyMuPDF |
| `POST /api/ai/generate-quiz` | `POST` | Synthesizes 4-option MCQs from content with explanations & citations |
| `POST /api/ai/calculate-skill-gap` | `POST` | Computes multidimensional competency deficits ($\Delta$) against benchmarks |
| `POST /api/ai/predictive-analytics` | `POST` | 12-month predictive capability forecasting model |
| `POST /api/ai/semantic-search` | `POST` | Vector similarity search across vectorized MoSPI documentation |

---

---

## 9. Environment Variables & Setup Guide (`.env.example`)

Saksham AI uses a 3-tier microservice architecture. Each service has its own dedicated `.env` configuration file. A root template is provided in [`.env.example`](file:///j:/Coding/WEB%20DEV/IITM/SIH26/Saksham-AI---SIH26/.env.example).

### Microservices Configuration Structure

```
Saksham-AI---SIH26/
├── .env.example                          # Root aggregated template
├── backend/
│   ├── ai_service/
│   │   ├── .env.example                  # AI Engine configuration template
│   │   └── .env                          # Local AI Engine environment (Git-ignored)
│   └── gateway_service/
│       ├── .env.example                  # Gateway & DB configuration template
│       └── .env                          # Local Gateway environment (Git-ignored)
└── frontend/
    ├── .env.example                      # React Vite configuration template
    └── .env                              # Local Frontend environment (Git-ignored)
```

### Quick Setup: Create `.env` Files from Templates

#### Windows (Command Prompt)
```cmd
copy backend\ai_service\.env.example backend\ai_service\.env
copy backend\gateway_service\.env.example backend\gateway_service\.env
copy frontend\.env.example frontend\.env
```

#### Windows (PowerShell)
```powershell
Copy-Item backend\ai_service\.env.example backend\ai_service\.env
Copy-Item backend\gateway_service\.env.example backend\gateway_service\.env
Copy-Item frontend\.env.example frontend\.env
```

#### Linux / macOS
```bash
cp backend/ai_service/.env.example backend/ai_service/.env
cp backend/gateway_service/.env.example backend/gateway_service/.env
cp frontend/.env.example frontend/.env
```

---

### Detailed Environment Variables Reference

#### 1. Node.js API Gateway (`backend/gateway_service/.env`)

| Variable | Required | Default / Example | Purpose & Notes |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | `5000` | Port on which the Gateway Express server listens |
| `NODE_ENV` | Yes | `development` / `production` | Runtime mode |
| `JWT_SECRET` | Yes | `saksham_super_secret_jwt_key_...` | Cryptographic secret for signing RBAC session tokens |
| `DATA_ENCRYPTION_KEY` | Yes | `saksham_ai_mospi_secure_key_2026_32char!!` | 32-character key for AES-256-CBC field encryption |
| `PYTHON_AI_URL` | Yes | `http://127.0.0.1:8000` | Internal URL to Python FastAPI microservice |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db?sslmode=require` | PostgreSQL connection URI (Neon DB or local Postgres) |
| `REDIS_URL` | Yes | `rediss://default:token@host:6379` | Redis connection URI (Upstash Redis or local Redis) |

#### 2. Email OTP Delivery Configuration (Choose One Option)

> [!IMPORTANT]
> **Cloud Deployment Notice (Render Free Tier):** Render Free Tier strictly blocks outbound TCP ports `25`, `465`, and `587`. For cloud deployments on Render Free Tier, use **Option B (Brevo REST API)**, which communicates over HTTPS Port 443 and delivers to any email address globally without custom domain setup. Check your deployed server status anytime at `GET /api/auth/email-health`.

* **Option A: Gmail / Standard SMTP (Best for Localhost & Paid Cloud / VPS)**
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your_gmail_address@gmail.com
  SMTP_PASS=your_16_character_google_app_password
  SMTP_FROM="Saksham AI - MoSPI" <your_gmail_address@gmail.com>
  ```
  *(Generate an App Password at: Google Account → Security → 2-Step Verification → App passwords)*

* **Option B: Brevo REST API (RECOMMENDED for Render Free Tier — No Domain Needed)**
  Sends 300 free emails/day to **any recipient email address globally** without custom domain DNS setup (HTTPS port 443):
  ```env
  BREVO_API_KEY=xkeysib-your_brevo_api_key_here
  BREVO_FROM_EMAIL=your_verified_gmail_address@gmail.com
  ```
  *(Sign up at [brevo.com](https://www.brevo.com) → Profile → SMTP & API → API Keys)*

#### 3. Python AI Engine (`backend/ai_service/.env`)

| Variable | Required | Default / Example | Purpose & Notes |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | `8000` | Port on which the FastAPI AI engine runs |
| `HOST` | Yes | `127.0.0.1` / `0.0.0.0` | Bind host address |
| `GEMINI_API_KEY` | Optional | `AQ.Ab8RN6...` | Google Gemini API key for conversational AI & quiz generation |
| `OPENAI_API_KEY` | Optional | `sk-proj-...` | OpenAI API key for embeddings, RAG & LLM evaluation |

#### 4. Frontend Portal (`frontend/.env`)

| Variable | Required | Default / Example | Purpose & Notes |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | `http://localhost:5000` | Base URL pointing to the Node.js API Gateway (use live cloud URL for production) |

---

## 10. Quick Start Guide

### Option A: 1-Click Launch (Windows)
Double-click `start_all.bat` or run:
```cmd
start_all.bat
```
*Launches Python AI Engine (Port 8000), Gateway Service (Port 5000), and Vite Frontend (Port 3000) simultaneously.*

### Option B: 1-Click PowerShell Launch
```powershell
.\start_all.ps1
```

### Option C: Manual Execution

#### 1. Python AI Service (Port 8000)
```bash
cd backend/ai_service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Interactive Swagger UI:* [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### 2. Node.js API Gateway (Port 5000)
```bash
cd backend/gateway_service
npm install
npm start
```
*Gateway Health Status:* [http://localhost:5000/health](http://localhost:5000/health)  
*Email Diagnostic Status:* [http://localhost:5000/api/auth/email-health](http://localhost:5000/api/auth/email-health)

#### 3. Frontend Portal (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Open Application:* [http://localhost:3000](http://localhost:3000)

---

## 11. Security, Compliance & Data Governance

* **AES-256-CBC Field Encryption:** National identifiers and sensitive employee records are encrypted before database persistence.
* **DPDPA 2023 Compliance:** Built strictly following India's Digital Personal Data Protection Act with complete user data isolation.
* **Role-Based Access Control (RBAC):** Strict JWT verification separating Learners, Trainers, and System Administrators.
* **W3C Verifiable Credentials 2.0:** Tamper-proof certificate issuance with cryptographic SHA-256 digest validation.
* **UN Fundamental Principles of Official Statistics:** Strict statistical confidentiality and microdata protection protocols.

---

## 12. Institutional Attribution & License

Developed for the **Ministry of Statistics & Programme Implementation (MoSPI)**, Government of India, for **Smart India Hackathon 2026** (Problem Statement ID: 26101).

---
<p align="center">
  © 2026 <strong>SAKSHAM AI</strong>. All Rights Reserved.<br>
  <em>Official Statistics Skill Intelligence & Capacity Building Platform</em>
</p>
