import sys
import os

# Add directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from services.quiz_generator import QuizGenerator
from services.skill_gap_engine import SkillGapEngine
from services.predictive_analytics import PredictiveAnalyticsEngine

def test_quiz_generator():
    sample_text = """
    National Accounts Compilation:
    Gross Value Added (GVA) at basic prices is defined as Output at basic prices minus Intermediate Consumption at purchasers prices.
    FISIM (Financial Intermediation Services Indirectly Measured) must be allocated across user sectors.
    Double deflation requires deflating gross output using output price index and intermediate inputs using input price index.
    """
    questions = QuizGenerator.generate_quiz_from_collection(
        collection_name="test_col",
        topic_or_query="National Accounts GVA SNA 2008",
        num_questions=3,
        difficulty="Medium",
        competency_tag="NAT_ACC_01"
    )
    assert len(questions) >= 1
    q1 = questions[0]
    assert "question_text" in q1
    assert "option_a" in q1
    assert "correct_option" in q1
    assert "explanation" in q1
    print(f"[OK] MCQ Generation Passed: Generated {len(questions)} questions with explanations & difficulty tags.")

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
        "comp_policy_advisory": 3.2
    }
    result = SkillGapEngine.calculate_skill_gap(user_profile, user_comps)
    assert "competency_breakdown" in result
    assert "priority_gaps" in result
    assert "readiness_percentage" in result
    assert len(result["competency_breakdown"]) == 7
    print(f"[OK] Skill Gap Analysis Engine Passed: Overall Readiness = {result['readiness_percentage']}%")

def test_predictive_analytics():
    overview = PredictiveAnalyticsEngine.get_department_competency_overview()
    assert "departments" in overview
    assert "summary_kpis" in overview
    assert "emerging_trends" in overview
    print("[OK] Predictive Workforce Analytics Passed: Monitored Departments:", len(overview["departments"]))

if __name__ == "__main__":
    print("--- Running Saksham AI Python Intelligence Engine Tests ---")
    test_quiz_generator()
    test_skill_gap_calculation()
    test_predictive_analytics()
    print("=== ALL AI ENGINE UNIT TESTS PASSED SUCCESSFULLY! ===")
