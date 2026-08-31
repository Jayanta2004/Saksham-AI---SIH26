import os
import shutil
import tempfile
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

# --- Endpoints ---

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Saksham AI Python Backend",
        "version": "1.0.0",
        "official_system": "MoSPI / NSSTA / iGOT Karmayogi",
        "rag_engine": "Active"
    }

@app.post("/api/ai/parse-document")
async def parse_document(
    file: UploadFile = File(...),
    collection_name: Optional[str] = Form("coll_uploaded_doc"),
    competency_tag: Optional[str] = Form("STAT_SMP_01"),
    x_openai_key: Optional[str] = Header(None)
):
    """
    Ingest uploaded PDF / PPT / PPTX file, extract text/slides, chunk semantically,
    and index into the vector store.
    """
    allowed_exts = [".pdf", ".ppt", ".pptx", ".txt", ".docx"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{file_ext}'. Please upload PDF, PPT, PPTX, or TXT."
        )

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        parsed_items = DocumentParser.parse_file(tmp_path)
        if not parsed_items:
            raise HTTPException(status_code=422, detail="Unable to extract text from the uploaded document.")

        chunks = DocumentParser.chunk_document(parsed_items, chunk_size=500, chunk_overlap=100)
        
        # Tag competency metadata
        for c in chunks:
            c["competency_tag"] = competency_tag

        # Index in vector store
        v_store = get_or_create_collection(collection_name)
        v_store.add_chunks(chunks, openai_api_key=x_openai_key)

        return {
            "success": True,
            "file_name": file.filename,
            "file_type": file_ext.replace(".", "").upper(),
            "extracted_pages_or_slides": len(parsed_items),
            "chunks_count": len(chunks),
            "collection_name": collection_name,
            "competency_tag": competency_tag,
            "sample_chunks": chunks[:3]
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/api/ai/generate-quiz")
async def generate_quiz(
    payload: QuizGenerateRequest,
    x_openai_key: Optional[str] = Header(None)
):
    """
    RAG-driven MCQ and Quiz Generation endpoint.
    Queries vector store or provided text, generates questions with options, difficulty,
    correct answer, step-by-step explanation, and source citations.
    """
    # If raw text was sent directly, create temporary chunk
    if payload.text_content:
        temp_coll = f"temp_coll_{payload.collection_name}"
        v_store = get_or_create_collection(temp_coll)
        sample_chunk = [{
            "chunk_id": "raw_chk_1",
            "text": payload.text_content,
            "source_location": "Uploaded Training Material Excerpt"
        }]
        v_store.add_chunks(sample_chunk, openai_api_key=x_openai_key)
        coll_to_use = temp_coll
    else:
        coll_to_use = payload.collection_name

    questions = QuizGenerator.generate_quiz_from_collection(
        collection_name=coll_to_use,
        topic_or_query=payload.topic_focus or "Official statistics methods and regulations",
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
        competency_tag=payload.competency_tag,
        openai_api_key=x_openai_key
    )

    return {
        "success": True,
        "collection_name": coll_to_use,
        "difficulty": payload.difficulty,
        "competency_tag": payload.competency_tag,
        "total_generated": len(questions),
        "questions": questions
    }

@app.post("/api/ai/calculate-skill-gap")
def calculate_skill_gap(payload: SkillGapRequest):
    """
    Competency Graph & Skill Gap Score calculation.
    Compares officer profile against MoSPI role benchmarks and outputs personalized pathway.
    """
    result = SkillGapEngine.calculate_skill_gap(
        user_profile=payload.user_profile,
        user_competencies=payload.user_competencies,
        available_courses=payload.available_courses
    )
    return result

@app.post("/api/ai/predictive-analytics")
def get_predictive_analytics():
    """
    Workforce Competency Heatmap and 12-Month Predictive Trends.
    """
    return PredictiveAnalyticsEngine.get_department_competency_overview()

@app.post("/api/ai/semantic-search")
def semantic_search(payload: SemanticSearchRequest, x_openai_key: Optional[str] = Header(None)):
    """
    Vector search for document chunks.
    """
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
