# SAKSHAM AI — Skill Intelligence & Learning Platform
### *AI-Enabled Competency Assessment, Skill-Gap Analytics & Personalized Training Engine for India's Official Statistical System*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in)
[![Organization](https://img.shields.io/badge/Organization-MoSPI%20%2F%20DIID-orange.svg)](https://mospi.gov.in)
[![FastAPI Docs](https://img.shields.io/badge/Swagger%20UI-FastAPI%20%7C%20Port%208000-009688.svg)](http://127.0.0.1:8000/docs)
[![API Gateway](https://img.shields.io/badge/API%20Gateway-Express%20%7C%20Port%205000-339933.svg)](http://localhost:5000/health)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Port%203000-61DAFB.svg)](http://localhost:3000)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Neon%20Cloud-4169E1.svg)](#)
[![Security](https://img.shields.io/badge/Security-AES--256%20%7C%20DPDPA%202023-red.svg)](#)
[![Integration](https://img.shields.io/badge/Integration-iGOT%20Karmayogi%20%2B%20NSSTA-blueviolet.svg)](#)

---

## 1. Executive Summary & Problem Statement

India's statistical system is undergoing a massive transformation with the integration of modern digital workflows, Big Data analytics, AI/ML models, Computer Assisted Personal Interviewing (CAPI), and administrative data integration. Statistical officers across the **Ministry of Statistics & Programme Implementation (MoSPI)**, **Central Statistics Office (CSO)**, **National Sample Survey Office (NSSO)**, and **National Statistical Systems Training Academy (NSSTA)** require continuous capability enhancement.

While the **iGOT Karmayogi** platform provides vast e-learning repositories, statistical personnel encounter major friction in discovering courses mapped to their specific cadre hierarchy, job descriptions, and actual mathematical skill gaps.

**Saksham AI** bridges this gap by delivering a **Unified AI-Powered Skill Intelligence and Learning Platform** tailored specifically for India's Official Statistical Cadres (*Indian Statistical Service - ISS, Subordinate Statistical Service - SSS*).

### Institutional Metadata
* **Ministry / Nodal Body:** Ministry of Statistics & Programme Implementation (MoSPI), Govt. of India
* **Implementing Divisions:** Data Informatics & Innovation Division (DIID) & NSSTA Greater Noida
* **Theme & Category:** Smart Education | Software Prototype
* **Target Ecosystems:** `mospi.gov.in`, `nssta.gov.in`, `iGOT Karmayogi`, `TPAC Training Calendar`

---

## 2. Key Platform Capabilities

| Capability | Technical Description | SIH Problem Alignment |
| :--- | :--- | :--- |
| **AI Competency Profiling** | Evaluates baseline proficiency across official statistical standards (*Survey Sampling, SNA 2008 National Accounts, Python/R Analytics, DPDPA 2023*). | *Automated Competency Framework Mapping* |
| **Mathematical Skill-Gap Engine** | Computes multi-dimensional capability deficits ($\Delta = Benchmark - Current$) and renders interactive 7-axis Recharts Radar Charts. | *Automated Skill-Gap Analysis* |
| **Dual iGOT & NSSTA Sync** | Bi-directional API connectors synchronizing e-learning modules from **iGOT Karmayogi** and in-person residential workshops from **NSSTA Greater Noida**. | *Seamless iGOT & NSSTA Integration* |
| **RAG Assessment & MCQ Generator** | Parses uploaded PDFs/training manuals to synthesize 4-option MCQs with difficulty tags, rationale, and official manual citations. | *AI-Powered Assessment Engine* |
| **AI Virtual Learning Assistant** | Multi-session domain chatbot grounded in official guidelines (SNA 2008 GDP/GVA compilation, Multi-stage sampling, DPDPA confidentiality). | *Real-Time Learner Support* |
| **Divisional & Predictive Analytics** | 12-month predictive capability forecasting model and comparative matrix across divisions (**NAD, SDRD, FOD, CSO**). | *Workforce Analytics & Capacity Planning* |
| **Dynamic Credential Verification** | Issues cryptographically formatted, tamper-resistant certificates (`SAKSHAM-[USER]-[ATTEMPT]`) on passing diagnostic assessments. | *Skill Credentialing & Verification* |
| **Instant Self-Registration & OTP** | Self-service registration auto-activating users immediately, accompanied by 6-digit OTP password reset. | *DPDPA 2023 Compliant Auth & RBAC* |

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
└───────────────────┘    └───────────────────┘                           └───────────────────┘     └───────────────────┘
```

---

## 4. 7-Tier System Architecture

```mermaid
graph TD
    subgraph UI ["1. Presentation Layer (Vite React.js & Tailwind CSS - Port 3000)"]
        LearnerPortal["Learner Portal (Radar Graph, Learning Path, Quiz Arena, Profile, Certificates)"]
        AdminPortal["Admin Hub (Workforce Analytics, Departmental Matrix, Content Studio)"]
        AiChat["AI Virtual Assistant (Isolated Multi-Session Chat Engine)"]
    end

    subgraph Gateway ["2. API Gateway & Security Layer (Node.js Express - Port 5000)"]
        JWTAuth["JWT Authentication & RBAC (Learner, Trainer, Sysadmin)"]
        CryptoEngine["AES-256 Field Encryption (PII & National Identifiers)"]
        RedisCache["Redis Hybrid Caching Layer (TTL 3600s)"]
    end

    subgraph AI ["3. AI Intelligence & RAG Engine (Python FastAPI - Port 8000)"]
        DocChunker["Document & Slide Chunker (PDF / PPTX / DOCX Parser)"]
        MCQGen["RAG MCQ Synthesizer (Citation & Explanation Engine)"]
        GapAnalyzer["Mathematical Competency Graph & Skill-Gap Analyzer"]
        Predictor["12-Month Workforce Predictive Forecasting Engine"]
    end

    subgraph Integration ["4. Ecosystem Sync Connectors"]
        iGOTConnector["iGOT Karmayogi Course & Progress Sync API"]
        NSSTAConnector["NSSTA / TPAC Residential Workshop Sync API"]
    end

    subgraph Database ["5. Persistence & Storage Layer"]
        PostgresDB["Neon Cloud PostgreSQL Database (SSL Active)"]
        VectorDB["ChromaDB / In-Memory Vector Store"]
    end

    UI -->|REST / JWT| Gateway
    Gateway -->|Forward AI Requests| AI
    Gateway -->|Sync Catalogues| Integration
    Gateway -->|Persist Records| PostgresDB
    AI -->|Embeddings & Retrieval| VectorDB
```

---

## 5. Python AI Microservice & Swagger API Docs (Port 8000)

The **Saksham AI Python Microservice** (`backend/ai_service`) runs on FastAPI, PyMuPDF, Scikit-Learn, and Vector Embeddings.

* **Live Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **OpenAPI JSON Specification:** [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

### Core AI Endpoints:

| HTTP Method | Endpoint Path | Functionality Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & microservice status verification |
| `POST` | `/api/ai/chat` | Domain-grounded conversational AI assistant for statistical officers |
| `POST` | `/api/ai/parse-document` | Parses uploaded training manuals (PDF, DOCX, PPTX) into structured chunks |
| `POST` | `/api/ai/generate-quiz` | Synthesizes 4-option MCQs using RAG with difficulty tags & official manual citations |
| `POST` | `/api/ai/calculate-skill-gap` | Calculates multi-dimensional competency gaps ($\Delta$) against MoSPI benchmarks |
| `POST` | `/api/ai/predictive-analytics` | Computes 12-month predictive workforce growth projections & divisional risk models |
| `POST` | `/api/ai/semantic-search` | Vector similarity search across vectorized MoSPI manuals and training documents |

---

## 6. API Gateway Endpoints Catalog (Node.js - Port 5000)

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Self-service registration (Instant auto-activation) |
| **Auth** | `/api/auth/login` | `POST` | JWT authentication with role authorization |
| **Auth** | `/api/auth/forgot-password` | `POST` | Dispatches 6-digit OTP verification code |
| **Auth** | `/api/auth/verify-otp` | `POST` | Validates OTP and updates password |
| **Learner** | `/api/users/competencies` | `GET` | Computes live competency scores & Recharts radar array |
| **Learner** | `/api/users/stats` | `GET` | Returns courses completed, learning hours, quizzes passed |
| **Learner** | `/api/users/certificates` | `GET` | Returns earned certificates with verification hashes |
| **Learner** | `/api/users/trajectory` | `GET` | Monthly capability trajectory & learning hours bar chart |
| **Courses** | `/api/courses` | `GET` | Fetches all published MoSPI & iGOT courses |
| **Quizzes** | `/api/assessments/quizzes` | `GET` | Lists all published diagnostic assessments |
| **Quizzes** | `/api/assessments/quiz/:id` | `GET` | Fetches assessment questions with randomized options |
| **Quizzes** | `/api/assessments/submit` | `POST` | Auto-grades attempt, updates competencies, issues certificate |
| **Sync** | `/api/sync/igot` | `GET` | Syncs course metadata from iGOT Karmayogi |
| **Sync** | `/api/sync/nssta` | `GET` | Syncs upcoming residential workshop schedule from NSSTA |
| **Admin** | `/api/admin/users` | `GET` | Administrative officer roster and competency audit |
| **Admin** | `/api/admin/workforce-analytics`| `GET` | Macro workforce readiness, KPIs, and systemic shortfalls |
| **Trainer**| `/api/trainer/publish-quiz` | `POST` | Saves and publishes AI-generated quizzes to Assessment Arena |

---

## 7. Pre-Configured Demo Personas

The platform includes 1-click quick login buttons for all evaluation personas:

| Persona | Name & Cadre | Role | Official Email | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| **Learner (SSO)** | **Arjun Sharma, ISS** | `role_learner` | `arjun.sharma@mospi.gov.in` | `Saksham@2026` |
| **Learner (JSO)** | **Priya Deshmukh, SSS** | `role_learner` | `priya.deshmukh@mospi.gov.in` | `Saksham@2026` |
| **Trainer / Faculty**| **Dr. Radhika Sen, ISS** | `role_trainer` | `radhika.sen@nssta.gov.in` | `Saksham@2026` |
| **System Admin** | **Rajesh K. Verma, ISS** | `role_sysadmin`| `rajesh.verma@mospi.gov.in` | `Saksham@2026` |

*Note: Any newly registered user on `/register` can set their own custom password and is activated immediately with dynamic personalized baseline stats.*

---

## 8. Frontend Route & Pages Map

### Learner Portal Routes
* `/dashboard` — Personal Competency Radar, Top Gaps, Key KPIs, AI Pathways
* `/profile` — Official Profile, Cadre Information, Edit Personal Details
* `/skills` — Category-wise breakdown of official competencies (*Statistical, Technical, Governance, Leadership*)
* `/skill-gap` — Mathematical deficit matrix with actionable recommendations
* `/learning-path` — Dynamic milestone roadmap derived from AI gap analysis
* `/courses` & `/courses/:id` — Course exploration with direct e-learning module links
* `/training` — In-person NSSTA workshops with persistent Self-Nomination
* `/assessments` & `/quiz/:id` — Diagnostic testing arena with instant grading & feedback
* `/ai-assistant` — Isolated multi-session AI assistant with personalized greetings
* `/progress` — Monthly capability trajectory and dynamic learning hours bar charts
* `/certificates` — Verified certificate gallery with modal preview and PDF download

### Administrator & Trainer Routes
* `/admin/dashboard` — Macro workforce readiness KPIs, 4-pillar bar chart, systemic deficits
* `/admin/analytics` — Departmental comparison matrix (**NAD, SDRD, FOD, CSO**), risk levels & 12-month predictive forecast
* `/admin/users` — Employee roster and competency score auditing
* `/admin/competencies` — Official MoSPI benchmark standards framework
* `/admin/content` — AI Assessment Content Studio (Document upload, RAG MCQ synthesis, publish live)
* `/admin/reports` — Exportable audit reports (Workforce Audit PDF, Skill Gap Matrix CSV)
* `/admin/settings` — Recommendation algorithm weights & sync frequency configuration

---

## 9. Quick Start & Execution Scripts

The repository includes pre-configured single-command automation scripts for all major runtime environments:

### Option A: 1-Click Windows Batch Script (`start_all.bat`)
Double-click `start_all.bat` or run from the root terminal:
```cmd
start_all.bat
```
*This simultaneously launches the Python AI engine (Port 8000), Node.js API Gateway (Port 5000), and Vite React frontend (Port 3000) in isolated, labeled command windows.*

### Option B: 1-Click PowerShell Script (`start_all.ps1`)
Run the PowerShell automation script:
```powershell
.\start_all.ps1
```

### Option C: Multi-Container Docker Deployment (`docker-compose.yml`)
To spin up all services in isolated Docker containers with automated PostgreSQL schema initialization and Redis caching:
```bash
docker-compose up --build
```
*Containerized Architecture:*
* `saksham_postgres` (Port 5432) — PostgreSQL 16 with automatic `schema.sql` and `seed.sql` mounting
* `saksham_redis` (Port 6379) — Redis 7 Alpine cache
* `saksham_ai_service` (Port 8000) — Python FastAPI RAG Engine
* `saksham_gateway` (Port 5000) — Node.js Express API Gateway

### Option D: Manual Service Execution

#### 1. Start Python AI Microservice (Port 8000)
```bash
cd backend/ai_service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Interactive Swagger API Docs:* **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

#### 2. Start Node.js API Gateway (Port 5000)
```bash
cd backend/gateway_service
npm install
npm run dev
```
*Gateway Health Status:* **[http://localhost:5000/health](http://localhost:5000/health)**

#### 3. Start Frontend Portal (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Open Application:* **[http://localhost:3000](http://localhost:3000)**

---

## 10. Environment Variables Configuration

### `backend/gateway_service/.env`
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=saksham_super_secret_jwt_key_2026_mospi_diid
DATABASE_URL=postgresql://neondb_owner:npg_n2z0aUuXjhLq@ep-lucky-smoke-a1t2f33l-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
PYTHON_AI_URL=http://127.0.0.1:8000
AES_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### `backend/ai_service/.env`
```env
PORT=8000
ENVIRONMENT=development
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

---

## 11. Security, Compliance & Data Governance

* **AES-256-CBC Field Encryption:** National identifiers and sensitive employee records are encrypted before database persistence.
* **DPDPA 2023 Compliance:** Built strictly following India's Digital Personal Data Protection Act with user data isolation.
* **Role-Based Access Control (RBAC):** Strict JWT verification separating Learners, Trainers, and System Administrators.
* **UN Fundamental Principles of Official Statistics:** Strict statistical confidentiality and microdata protection protocols.

---

## 12. License & Attribution
Developed for the **Smart India Hackathon (SIH) 2026** under the **Ministry of Statistics & Programme Implementation (MoSPI)** problem statement.

All rights reserved © 2026 Team 404 not founders.
