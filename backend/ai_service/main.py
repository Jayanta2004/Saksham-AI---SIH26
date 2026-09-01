import os
import shutil
import tempfile
import requests
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
    return {"status": "ok", "service": "Saksham AI Microservice", "version": "1.0.0"}

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

# --- Endpoints ---

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Saksham AI Python Backend",
        "version": "1.0.0",
        "official_system": "MoSPI / NSSTA / iGOT Karmayogi",
        "rag_engine": "Active",
        "llm_active": bool(os.getenv("GEMINI_API_KEY"))
    }

# chat handler for virtual assistant
@app.post("/api/ai/chat")
def handle_chat_message(payload: ChatMessageRequest):
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    user_info = payload.user_context or {}
    user_name = user_info.get("full_name", user_info.get("name", "Officer"))
    designation = user_info.get("designation", "Statistical Officer")
    dept = user_info.get("department", "Ministry of Statistics & Programme Implementation")

    system_instruction = f"""You are Saksham AI, the dedicated AI Learning & Competency Assistant for India's Ministry of Statistics & Programme Implementation (MoSPI) and NSSTA.

CRITICAL GUIDELINES:
1. Identity: You are strictly and exclusively "Saksham AI". NEVER mention Gemini, Google, OpenAI, ChatGPT, or any external AI provider.
2. Tone & Style: Be direct, clear, modern, and highly articulate. DO NOT use stiff ceremonial greetings like "Respected Shri..." or wordy preambles. Jump straight into the clear explanation.
3. Content: Explain technical, statistical, computing, data engineering, and administrative concepts (e.g. Docker, Python, SQL, Machine Learning, Survey Sampling, SNA 2008, CPI/WPI, DPDPA 2023) with exceptional clarity and structure.
4. Formatting: Use crisp bullet points, bold highlights, and clean paragraphs for maximum readability.
5. Learning Pathways: Where relevant, mention helpful courses available on iGOT Karmayogi or NSSTA."""

    prompt = f"{system_instruction}\n\nUser Question: {payload.message}\n\nDirect Answer:"

    if api_key:
        models = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                resp = requests.post(
                    url,
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    headers={"Content-Type": "application/json"},
                    timeout=25
                )
                if resp.status_code == 200:
                    data = resp.json()
                    answer = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"reply": answer, "model": model, "success": True}
            except Exception as e:
                # try next model
                pass

    # fallback answer
    return {
        "reply": f"Regarding your question about '{payload.message}': In official statistical systems (such as MoSPI and NSSO), understanding computational tools, reproducible survey pipelines, and standard methodologies is essential for accurate data processing and policy analytics.",
        "model": "fallback",
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
    results = v_store.query(payload.query, top_k=payload.top_k, openai_api_key=x_openai_key)
    return {
        "query": payload.query,
        "collection_name": payload.collection_name,
        "matches_count": len(results),
        "results": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
