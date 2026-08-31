import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app
from services.skill_gap_engine import SkillGapEngine
from services.predictive_analytics import PredictiveAnalyticsEngine

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[OK] Health Check Passed")

def test_generate_quiz_from_text():
    sample_text = """
    National Accounts Compilation:
    Gross Value Added (GVA) at basic prices is defined as Output at basic prices minus Intermediate Consumption at purchasers prices.
    FISIM (Financial Intermediation Services Indirectly Measured) must be allocated across user sectors.
    Double deflation requires deflating gross output using output price index and intermediate inputs using input price index.
    """
    response = client.post("/api/ai/generate-quiz", json={
        "collection_name": "test_sna_collection",
        "text_content": sample_text,
        "num_questions": 3,
        "difficulty": "Medium",
        "competency_tag": "NAT_ACC_01",
        "topic_focus": "SNA 2008 Gross Value Added"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["questions"]) == 3
    q1 = data["questions"][0]
    assert "question_text" in q1
    assert "option_a" in q1
    assert "correct_option" in q1
    assert "explanation" in q1
    assert "source_citation" in q1
    print(f"[OK] MCQ Generation Passed: Generated {len(data['questions'])} questions with explanations & difficulty tags.")

def test_skill_gap_calculation():
    user_profile = {
        "id": "usr_sso_01",
        "designation": "Senior Statistical Officer (SSO)",
        "department": "National Accounts Division (NAD)"
    }
    user_comps = {
        "comp_sna_accounts": 2.8,
        "comp_index_numbers": 3.5,
        "comp_sampling": 2.2,
        "comp_python_r_stats": 2.4,
        "comp_ai_microdata": 1.6,
        "comp_dpdpa_gov": 3.8,
        "comp_policy_advisory": 2.9
    }
    response = client.post("/api/ai/calculate-skill-gap", json={
        "user_profile": user_profile,
        "user_competencies": user_comps
    })
    assert response.status_code == 200
    data = response.json()
    assert "overall_gap_score" in data
    assert "recommended_pathway" in data
    assert len(data["recommended_pathway"]) > 0
    print(f"[OK] Skill Gap Engine Passed: Gap Score = {data['overall_gap_score']}%, Pathway steps = {len(data['recommended_pathway'])}")

def test_predictive_analytics():
    response = client.post("/api/ai/predictive-analytics")
    assert response.status_code == 200
    data = response.json()
    assert "departments" in data
    assert "emerging_trends" in data
    print(f"[OK] Predictive Analytics Passed: {len(data['departments'])} departments analyzed.")

if __name__ == "__main__":
    print("--- Running Saksham AI Python Backend Unit Tests ---")
    test_health()
    test_generate_quiz_from_text()
    test_skill_gap_calculation()
    test_predictive_analytics()
    print("=== ALL AI SERVICE UNIT TESTS PASSED SUCCESSFULLY! ===")

