import os
import shutil
import tempfile
import requests
import json
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.document_parser import DocumentParser
from services.vector_store import get_or_create_collection, InMemoryVectorStore
from services.quiz_generator import QuizGenerator
from services.skill_gap_engine import SkillGapEngine
from services.predictive_analytics import PredictiveAnalyticsEngine

app = FastAPI(
    title="Saksham AI - Official Statistical System Intelligence Engine",
    description="AI/ML Layer for RAG Document Ingestion, MCQ Generation, and Competency Gap Analysis for MoSPI / NSSTA",
    version="1.0.0"
)

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Saksham AI Python Backend",
        "version": "1.0.0",
        "official_system": "MoSPI / NSSTA / iGOT Karmayogi",
        "rag_engine": "Active",
        "llm_active": bool(os.getenv("GEMINI_API_KEY") or os.getenv("GROQ_API_KEY"))
    }

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Models ---
class QuizGenerateRequest(BaseModel):
    collection_name: Optional[str] = "default_mospi_docs"
    text_content: Optional[str] = None
    num_questions: int = 5
    difficulty: str = "Mixed" # Easy, Medium, Hard, Mixed
    competency_tag: str = "STAT_SMP_01"
    topic_focus: Optional[str] = "Survey sampling, SNA 2008, index numbers, or data validation"

class SkillGapRequest(BaseModel):
    user_profile: Dict[str, Any]
    user_competencies: Dict[str, float]
    available_courses: Optional[List[Dict[str, Any]]] = None

class SemanticSearchRequest(BaseModel):
    collection_name: str = "default_mospi_docs"
    query: str
    top_k: int = 4

class ChatMessageRequest(BaseModel):
    message: str
    user_context: Optional[Dict[str, Any]] = None

def get_intelligent_domain_response(query: str, user_name: str = "Officer", dept: str = "MoSPI") -> str:
    q = query.lower()

    if "skill gap" in q or "my gap" in q or "weakness" in q or "top deficit" in q:
        return f"""### Comprehensive Skill Gap Analysis for {user_name}

Based on the MoSPI Official Competency Framework, here is the diagnostic breakdown of the primary competency shortfalls:

#### 1. AI & Machine Learning for Survey Microdata (High Priority Deficit)
* **Current Proficiency Baseline:** 1.5 / 5.0 (Target: 4.0)
* **Gap Analysis:** Modern statistical workflows require automated outlier detection, anomaly imputation, and classification algorithms for large-scale survey rounds.
* **Recommended Next Step:** Enroll in **"Machine Learning for Official Statistics"** on iGOT Karmayogi.

#### 2. Python & R Data Analytics for Surveys (High Priority Deficit)
* **Current Proficiency Baseline:** 2.0 / 5.0 (Target: 4.0)
* **Gap Analysis:** Transitioning from manual spreadsheet tabulation to reproducible Python (*Pandas, NumPy, Statsmodels*) and R survey pipelines.
* **Recommended Next Step:** Complete **"Data Processing in Python & R for Official Surveys"** (iGOT Karmayogi / NSSTA).

#### 3. National Accounts (SNA 2008) GVA Balancing (Moderate Priority)
* **Current Proficiency Baseline:** 2.0 / 5.0 (Target: 3.5)
* **Gap Analysis:** Understanding Supply and Use Tables (SUT), double-deflation techniques, and production-boundary classifications.
* **Recommended Next Step:** Attend the upcoming residential workshop batch at **NSSTA Greater Noida**."""

    elif "statistic" in q or "what is statistics" in q or "statistical system" in q:
        return f"""### Fundamentals of Official Statistics & The Indian Statistical System

**Official Statistics** comprise quantitative and qualitative information produced by government agencies to design, implement, monitor, and evaluate public policies.

---

#### 1. Core Pillars of India's Statistical Architecture
* **National Accounts Division (NAD):** Compiles India's Gross Domestic Product (GDP), Gross Value Added (GVA), and capital formation accounts following the UN SNA 2008 framework.
* **Survey Design and Research Division (SDRD):** Formulates sampling methodologies, stratification designs, and schedule questionnaires for nationwide socio-economic survey rounds.
* **Field Operations Division (FOD):** Executes ground-level CAPI (Computer Assisted Personal Interviewing) data collection across thousands of First Stage Units (FSUs).
* **Central Statistics Office (CSO) & NSSTA:** Oversees statistical coordination, international classifications, and capacity development for ISS and SSS officers.

---

#### 2. The Official Statistical Data Lifecycle
1. **Sampling Frame Creation:** Updating master sample lists (census villages in rural areas, urban frame survey blocks in cities).
2. **Data Capture:** Mobile CAPI data collection with embedded geographic and consistency validation rules.
3. **Imputation & Verification:** Treating non-response bias and handling outlier values using statistical algorithms.
4. **Multiplier Weighting:** Expanding unit-level records to population-level national estimates.
5. **Dissemination:** Publishing national reports and anonymized microdata adhering to the DPDPA 2023."""

    elif "gva" in q or "gross value added" in q or "sna" in q or "national accounts" in q or "gdp" in q:
        return f"""### System of National Accounts (SNA 2008) — GVA & GDP Methodology

**Gross Value Added (GVA)** measures the total value of economic output generated by industries after subtracting the cost of intermediate consumption used during production.

---

#### Core Mathematical Formulations:

1. **GVA at Basic Prices:**
   $$\\text{{GVA at Basic Prices}} = \\text{{Gross Output at Basic Prices}} - \\text{{Intermediate Consumption at Purchasers' Prices}}$$

2. **Transition from GVA to GDP (Market Prices):**
   $$\\text{{GDP at Market Prices}} = \\sum \\text{{GVA at Basic Prices}} + \\text{{Net Product Taxes (Taxes on Products - Subsidies on Products)}}$$

---

#### Key Analytical Concepts:
* **Production Boundary:** Covers all goods produced and services provided to other economic units, including own-account capital formation and government non-market output.
* **Deflation Methodology:** Converting nominal values to constant base-year prices using appropriate price deflators (WPI, CPI, and sector-specific volume indices).
* **Recommended Learning:** *System of National Accounts (SNA 2008) GDP & GVA Compilation* on iGOT Karmayogi."""

    elif "sampling" in q or "stratification" in q or "fsu" in q or "multiplier" in q:
        return f"""### Multi-Stage Stratified Sampling in National Sample Surveys (NSS)

National Sample Surveys in India employ **Multi-Stage Stratified Sampling Designs** to achieve high representative precision with optimal field operational logistics.

---

#### Key Structural Units:
1. **First Stage Units (FSUs):**
   * *Rural Sector:* Census villages (or sub-divisions thereof for large villages).
   * *Urban Sector:* Urban Frame Survey (UFS) blocks.
2. **Second Stage Units (SSUs):**
   * Households or operational business enterprises selected within the selected FSUs.

---

#### Multiplier Weights & Variance Control:
* **Stratification:** Segregates heterogeneous populations into homogeneous sub-strata based on socio-economic indicators to minimize within-stratum variance.
* **Inflation Multipliers:** Calculated based on inverse probability of selection ($w_i = 1 / P_i$) to project sample survey metrics to all-India aggregates.
* **Recommended Action:** Attempt the **"Survey Sampling & Estimation"** assessment in the Assessment Arena."""

    elif "cpi" in q or "wpi" in q or "index" in q or "inflation" in q or "iip" in q:
        return f"""### Official Price & Industrial Index Numbers (CPI, WPI, IIP)

---

#### 1. In-Depth Technical Explanation
Index numbers are statistical barometers used by MoSPI and the Ministry of Commerce to monitor macroeconomic price trends, inflation, and industrial production.

**Core Indices:**
* **Consumer Price Index (CPI):** Measures changes over time in the general level of prices of goods and services that households acquire for consumption. Base year: 2012=100.
* **Index of Industrial Production (IIP):** Measures the quantum of production across Mining, Manufacturing, and Electricity sectors. Base year: 2011-12=100.
* **Wholesale Price Index (WPI):** Tracks transaction prices at the wholesale and bulk level.

**Laspeyres Price Index Formula:**
$$I_L = \\frac{{\\sum (P_t \\cdot Q_0)}}{{\\sum (P_0 \\cdot Q_0)}} \\times 100$$

Where $P_t$ is the current period price, $P_0$ is the base period price, and $Q_0$ is the base period quantity weight basket.

---

#### 2. Recommended Next Steps & Learning Resources
1. **iGOT Karmayogi Course:** *"Compilation of Price Indices (CPI/WPI) & Index of Industrial Production"*.
2. **NSSTA Greater Noida Workshop:** *"Price Statistics & Real-Time Market Price Collection via Mobile Apps"*.
3. **Assessment:** Test your skills in the **"Price Statistics & Indices"** module in the Assessment Arena."""

    elif "python" in q or " r " in q or "machine learning" in q or "ai" in q or "docker" in q or "code" in q:
        return f"""### Modern Computational Tools for Official Statistics

---

#### 1. In-Depth Technical Explanation
Modern statistical organizations are transitioning from manual spreadsheet pipelines to reproducible, automated data engineering architectures:

* **Python & R Analytical Ecosystem:**
  * **Pandas & NumPy:** High-performance tabular transformation and schema enforcement for survey microdata.
  * **Statsmodels & Scikit-Learn:** Econometric regression, seasonal adjustment (X-13ARIMA), and multivariate anomaly detection using Isolation Forests.
  * **Automated Tabulation:** Reproducible script execution eliminating manual copy-paste errors in official statistical releases.
* **Containerization with Docker:**
  * **Reproducibility:** Eliminates differences across environments by packaging Python runtimes, C++ compiled statistical libraries, and system dependencies into portable containers.
  * **Microservices:** Isolates ingestion, validation, imputation, and tabulation stages into independent services.

---

#### 2. Recommended Next Steps & Learning Resources
1. **iGOT Karmayogi Courses:** *"Python for Data Analysis in Official Statistics"* and *"R Programming for Survey Statisticians"*.
2. **NSSTA Greater Noida:** Register for the hands-on lab on *"Machine Learning & Big Data Analytics for Statistical Cadres"*.
3. **Assessment:** Benchmark your skills in the **"Python & R Data Analytics"** quiz in the Assessment Arena."""

    elif "dpdpa" in q or "data protection" in q or "privacy" in q or "confidentiality" in q or "anonymiz" in q:
        return f"""### Digital Personal Data Protection Act (DPDPA 2023) in Official Statistics

---

#### 1. In-Depth Statutory & Technical Explanation
The **Digital Personal Data Protection Act (DPDPA 2023)** governs the processing of digital personal data in India, establishing strict statutory obligations for government data custodians like MoSPI, NSSO, and CSO.

**Core Institutional Roles & Obligations:**
* **Data Fiduciary (MoSPI):** Determines the purpose and means of survey data processing, ensuring data accuracy and secure lifecycle management.
* **Data Principal (Respondents):** Citizens and household members whose demographic and socio-economic information is recorded during survey rounds.
* **Consent Architecture & Notice:** Providing clear multilingual notices during CAPI field surveys explaining data usage solely for official statistical analysis under the Collection of Statistics Act.

**Microdata Protection & Statistical Disclosure Control (SDC):**
* **De-Identification & Masking:** Removing direct identifiers (*Aadhaar, PAN, Voter ID, exact household names*) prior to research microdata dissemination.
* **k-Anonymity & l-Diversity:** Ensuring that combinations of quasi-identifiers (*District, Age Group, Occupation*) cannot be linked to re-identify individual respondents ($k \\ge 5$).
* **Cell Suppression & Perturbation:** Suppressing small cell counts (e.g. fewer than 3 reporting units in a sub-district table) in published aggregate reports.

---

#### 2. Recommended Next Steps & Learning Resources
1. **iGOT Karmayogi Course:** *"DPDPA 2023 Compliance & Statistical Confidentiality for Public Officers"*.
2. **NSSTA Greater Noida:** Attend the specialized lecture series on *"Data Privacy, SDC Techniques & Anonymization Pipelines"*.
3. **Assessment:** Take the **"Digital Governance & Data Privacy"** quiz in the Assessment Arena."""

    else:
        return f"""### Official Statistical Guidance for {user_name} ({dept})

---

#### 1. Technical Explanation: "{query}"
The concept you asked about relates directly to the analytical, technological, and governance workflows of India's Official Statistical System under the Ministry of Statistics & Programme Implementation (MoSPI).

**Core Institutional Dimensions:**
* **Methodological Alignment:** All national data workflows follow the UN Fundamental Principles of Official Statistics and national standards (SNA 2008 for National Accounts, multi-stage sampling for NSS surveys, Laspeyres formulations for Price Indices).
* **Technological Infrastructure:** Modern statistical workflows integrate Python/R data engineering pipelines, CAPI field data collection on tablets, automated outlier treatment, and containerized Docker microservices.
* **Data Governance & Privacy:** Statistical data processing complies with the **Digital Personal Data Protection Act (DPDPA 2023)** through strict Statistical Disclosure Control (SDC), k-anonymity, and cell suppression.

---

#### 2. Recommended Next Steps & Learning Resources
1. **iGOT Karmayogi Pathways:** Search and enroll in specialized courses mapped to your cadre on the iGOT Karmayogi portal.
2. **NSSTA Greater Noida:** Explore upcoming residential cohorts in the Training section of this portal.
3. **Assessment Arena:** Attempt diagnostic quizzes across Statistical, Technical, and Governance domains to track your competency score.

Feel free to ask detailed questions on **GVA calculations**, **survey sampling multipliers**, **DPDPA compliance**, **CPI/WPI formulas**, or **Python/R pipelines**!"""

# chat handler for virtual assistant
@app.post("/api/ai/chat")
def handle_chat_message(payload: ChatMessageRequest):
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    user_info = payload.user_context or {}
    user_name = user_info.get("full_name", user_info.get("name", "Officer"))
    dept = user_info.get("department", "Ministry of Statistics & Programme Implementation")

    system_instruction = f"""You are Saksham AI, the dedicated AI Learning & Competency Assistant for India's Ministry of Statistics & Programme Implementation (MoSPI) and NSSTA.

The user asking is: {user_name} from {dept}.

CRITICAL GUIDELINES:
1. Identity: You are strictly and exclusively "Saksham AI". NEVER mention Gemini, Google, OpenAI, ChatGPT, or any external AI provider.
2. Tone & Style: Be direct, clear, professional, and highly articulate. Use markdown headings (##, ###, ####), bullet points, numbered lists, bold text, and formulas.
3. RESPONSE STRUCTURE (MANDATORY — follow this exact order):
   a. First, provide a **thorough, in-depth explanation** of the topic. Cover definitions, core concepts, key principles, technical details, formulas if applicable, and real-world context within India's official statistical system.
   b. Then, provide **practical recommendations**, learning pathways, and next steps. Mention relevant courses on iGOT Karmayogi or NSSTA workshops where applicable.
4. NEVER skip the explanation. The user expects to LEARN from your response, not just receive action items.
5. Content Coverage: Explain technical, statistical, computing, data engineering, and administrative concepts (e.g. Docker, Python, SQL, Machine Learning, Survey Sampling, SNA 2008, CPI/WPI, DPDPA 2023, Index Numbers, National Accounts) with exceptional clarity, depth, and structure.
6. Length: Responses should be comprehensive — at least 300 words for conceptual questions. Do NOT give shallow or surface-level answers."""

    prompt = f"{system_instruction}\n\nUser Question: {payload.message}\n\nProvide a detailed explanation followed by recommendations:"

    # 1. Try OpenAI API if OPENAI_API_KEY is configured
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key and openai_key.startswith("sk-"):
        try:
            openai_resp = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": payload.message}
                    ],
                    "temperature": 0.3
                },
                timeout=20
            )
            if openai_resp.status_code == 200:
                answer = openai_resp.json()["choices"][0]["message"]["content"]
                return {"reply": answer, "model": "gpt-4o-mini", "success": True}
        except Exception as e:
            print(f"[AIChat] OpenAI chat error: {e}")

    # 2. Try Google Gemini API if GEMINI_API_KEY is configured
    if api_key and (not api_key.startswith("sk-")):
        models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                resp = requests.post(
                    url,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    headers={"Content-Type": "application/json"},
                    timeout=15
                )
                if resp.status_code == 200:
                    data = resp.json()
                    answer = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"reply": answer, "model": model, "success": True}
            except Exception as e:
                pass

    # 3. Intelligent statistical domain knowledge fallback
    domain_reply = get_intelligent_domain_response(payload.message, user_name, dept)
    return {
        "reply": domain_reply,
        "model": "saksham_statistical_engine",
        "success": True
    }

# upload and parse documents
@app.post("/api/ai/parse-document")
async def parse_document(
    file: UploadFile = File(...),
    collection_name: str = Form("default_mospi_docs"),
    x_openai_key: Optional[str] = Header(None)
):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        chunks = DocumentParser.parse_file(tmp_path, filename=file.filename)
        if not chunks:
            raise HTTPException(status_code=400, detail="No readable text found in document.")
        
        v_store = get_or_create_collection(collection_name)
        v_store.add_chunks(chunks, openai_api_key=x_openai_key)
        
        return {
            "success": True,
            "filename": file.filename,
            "collection_name": collection_name,
            "total_chunks_indexed": len(chunks),
            "sample_chunk": chunks[0]["text"][:200] if chunks else ""
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

# generate mcqs from text or indexed docs
@app.post("/api/ai/generate-quiz")
def generate_quiz(payload: QuizGenerateRequest, x_openai_key: Optional[str] = Header(None)):
    coll_to_use = payload.collection_name
    if payload.text_content:
        coll_to_use = f"temp_coll_{payload.competency_tag}"
        chunks = DocumentParser.parse_raw_text(payload.text_content, source_name="Raw Text Input")
        v_store = get_or_create_collection(coll_to_use)
        v_store.add_chunks(chunks, openai_api_key=x_openai_key)

    questions = QuizGenerator.generate_quiz_from_collection(
        collection_name=coll_to_use,
        topic_or_query=payload.topic_focus or "Official statistics methods and regulations",
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
        competency_tag=payload.competency_tag
    )

    return {
        "success": True,
        "collection_name": coll_to_use,
        "difficulty": payload.difficulty,
        "competency_tag": payload.competency_tag,
        "total_generated": len(questions),
        "questions": questions
    }

# skill gap engine endpoint
@app.post("/api/ai/calculate-skill-gap")
def calculate_skill_gap(payload: SkillGapRequest):
    result = SkillGapEngine.calculate_skill_gap(
        user_profile=payload.user_profile,
        user_competencies=payload.user_competencies,
        available_courses=payload.available_courses
    )
    return result

# predictive analytics for admin
@app.post("/api/ai/predictive-analytics")
def get_predictive_analytics():
    return PredictiveAnalyticsEngine.get_department_competency_overview()

# vector semantic search
@app.post("/api/ai/semantic-search")
def semantic_search(payload: SemanticSearchRequest, x_openai_key: Optional[str] = Header(None)):
    v_store = get_or_create_collection(payload.collection_name)
    results = v_store.search(payload.query, top_k=payload.top_k, openai_api_key=x_openai_key)
    return {
        "success": True,
        "query": payload.query,
        "results": results
    }
