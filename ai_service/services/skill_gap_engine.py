import math
from typing import List, Dict, Any, Optional

# Standard MoSPI / Official Statistical System Competency Benchmarks by Role & Cadre
DEFAULT_ROLE_BENCHMARKS = {
    "Senior Statistical Officer (SSO)": {
        "comp_sna_accounts": {"required": 4.0, "weight": 1.20, "name": "National Accounts (SNA 2008)"},
        "comp_index_numbers": {"required": 4.0, "weight": 1.10, "name": "CPI / WPI Index Numbers"},
        "comp_sampling": {"required": 3.5, "weight": 1.00, "name": "Survey Sampling & Multipliers"},
        "comp_python_r_stats": {"required": 4.0, "weight": 1.15, "name": "Python & R Data Processing"},
        "comp_ai_microdata": {"required": 3.0, "weight": 0.85, "name": "AI / ML in Survey Microdata"},
        "comp_dpdpa_gov": {"required": 4.0, "weight": 1.00, "name": "DPDPA & Data Confidentiality"},
        "comp_policy_advisory": {"required": 3.0, "weight": 0.80, "name": "Evidence-Based Policy Translation"}
    },
    "Junior Statistical Officer (JSO)": {
        "comp_sna_accounts": {"required": 2.5, "weight": 1.00, "name": "National Accounts (SNA 2008)"},
        "comp_index_numbers": {"required": 3.0, "weight": 1.00, "name": "CPI / WPI Index Numbers"},
        "comp_sampling": {"required": 3.5, "weight": 1.20, "name": "Survey Sampling & Multipliers"},
        "comp_python_r_stats": {"required": 3.0, "weight": 1.10, "name": "Python & R Data Processing"},
        "comp_ai_microdata": {"required": 2.0, "weight": 0.80, "name": "AI / ML in Survey Microdata"},
        "comp_dpdpa_gov": {"required": 3.0, "weight": 1.00, "name": "DPDPA & Data Confidentiality"},
        "comp_policy_advisory": {"required": 2.0, "weight": 0.70, "name": "Evidence-Based Policy Translation"}
    },
    "Director / Joint Director (NSSO/CSO)": {
        "comp_sna_accounts": {"required": 4.5, "weight": 1.20, "name": "National Accounts (SNA 2008)"},
        "comp_index_numbers": {"required": 4.5, "weight": 1.20, "name": "CPI / WPI Index Numbers"},
        "comp_sampling": {"required": 4.5, "weight": 1.20, "name": "Survey Sampling & Multipliers"},
        "comp_python_r_stats": {"required": 3.5, "weight": 0.90, "name": "Python & R Data Processing"},
        "comp_ai_microdata": {"required": 3.5, "weight": 1.00, "name": "AI / ML in Survey Microdata"},
        "comp_dpdpa_gov": {"required": 5.0, "weight": 1.30, "name": "DPDPA & Data Confidentiality"},
        "comp_policy_advisory": {"required": 5.0, "weight": 1.30, "name": "Evidence-Based Policy Translation"}
    }
}

class SkillGapEngine:
    """
    Skill Gap & Personalized Learning Pathway Recommendation Engine.
    Computes mathematical skill deficit matrices and synthesizes multi-stage training roadmaps
    combining iGOT Karmayogi online modules and NSSTA/TPAC specialized workshops.
    """

    @staticmethod
    def calculate_skill_gap(
        user_profile: Dict[str, Any],
        user_competencies: Dict[str, float],
        available_courses: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Calculates role-specific skill gap score and generates personalized pathway.
        """
        designation = user_profile.get("designation", "Senior Statistical Officer (SSO)")
        department = user_profile.get("department", "National Accounts Division (NAD)")
        
        # Match benchmark
        benchmarks = DEFAULT_ROLE_BENCHMARKS.get(designation, DEFAULT_ROLE_BENCHMARKS["Senior Statistical Officer (SSO)"])
        
        competency_details = []
        total_weighted_gap = 0.0
        total_weighted_required = 0.0

        for comp_id, b_info in benchmarks.items():
            req_level = float(b_info["required"])
            weight = float(b_info["weight"])
            current_level = float(user_competencies.get(comp_id, 1.5))
            
            gap = max(0.0, req_level - current_level)
            gap_pct = min(100.0, (gap / req_level) * 100.0) if req_level > 0 else 0.0
            
            total_weighted_gap += (gap * weight)
            total_weighted_required += (req_level * weight)

            competency_details.append({
                "competency_id": comp_id,
                "name": b_info["name"],
                "current_level": round(current_level, 2),
                "required_level": round(req_level, 2),
                "gap": round(gap, 2),
                "gap_percentage": round(gap_pct, 1),
                "weight": weight,
                "status": "Target Met" if gap == 0 else ("Minor Gap" if gap <= 0.8 else "Critical Gap")
            })

        # Overall Gap Percentage (0% = Perfect Match, 100% = Maximum Gap)
        overall_gap_score = round((total_weighted_gap / total_weighted_required) * 100.0, 1) if total_weighted_required > 0 else 0.0
        overall_readiness_pct = round(100.0 - overall_gap_score, 1)

        # Readiness classification
        if overall_gap_score < 15.0:
            readiness_label = "Role-Ready / High Proficiency"
            color = "#10B981" # Green
        elif overall_gap_score < 35.0:
            readiness_label = "Moderate Gap - Upskilling Recommended"
            color = "#F59E0B" # Amber
        else:
            readiness_label = "Substantial Gap - Priority Capacity Building Required"
            color = "#EF4444" # Red

        # Sort gaps in descending order of urgency
        sorted_gaps = sorted(competency_details, key=lambda x: x["gap"] * x["weight"], reverse=True)

        # Generate Personalized Learning Pathway
        pathway = SkillGapEngine._generate_pathway(sorted_gaps, available_courses)

        return {
            "user_id": user_profile.get("id"),
            "designation": designation,
            "department": department,
            "overall_gap_score": overall_gap_score,
            "readiness_percentage": overall_readiness_pct,
            "readiness_label": readiness_label,
            "status_color": color,
            "competency_breakdown": competency_details,
            "priority_gaps": sorted_gaps[:3],
            "recommended_pathway": pathway,
            "estimated_hours_to_proficiency": sum([p.get("duration_hours", 10.0) for p in pathway])
        }

    @staticmethod
    def _generate_pathway(
        sorted_gaps: List[Dict[str, Any]], 
        available_courses: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        """
        Creates a sequential learning roadmap mapping highest gap competencies
        to specific iGOT Karmayogi e-learning and NSSTA residential workshops.
        """
        pathway = []
        step_number = 1

        # Catalog of official programs mapped to competency IDs
        catalogue_map = {
            "comp_sna_accounts": {
                "course_id": "crs_igot_01",
                "title": "Advanced National Accounts Compilation (SNA 2008 & 2025 Update)",
                "provider": "iGOT Karmayogi",
                "mode": "Online E-Learning",
                "duration_hours": 18.0,
                "expected_gain": "+1.2 Level",
                "urgency": "High",
                "url": "https://igotkarmayogi.gov.in/course/igot-stat-201"
            },
            "comp_python_r_stats": {
                "course_id": "crs_igot_02",
                "title": "Statistical Computing with Python: Survey Data Wrangling & Variance",
                "provider": "iGOT Karmayogi",
                "mode": "Online E-Learning",
                "duration_hours": 24.0,
                "expected_gain": "+1.4 Level",
                "urgency": "High",
                "url": "https://igotkarmayogi.gov.in/course/igot-py-301"
            },
            "comp_sampling": {
                "course_id": "crs_nssta_01",
                "title": "Residential Workshop on Complex Survey Sampling & Multi-Stage Stratification",
                "provider": "NSSTA",
                "mode": "Residential Workshop",
                "duration_hours": 35.0,
                "expected_gain": "+1.5 Level",
                "urgency": "Medium",
                "url": "https://nssta.gov.in/training/res-88"
            },
            "comp_ai_microdata": {
                "course_id": "crs_nssta_02",
                "title": "Executive Workshop on Machine Learning & AI in Official Statistical Validation",
                "provider": "NSSTA",
                "mode": "Residential Workshop",
                "duration_hours": 30.0,
                "expected_gain": "+1.6 Level",
                "urgency": "Medium",
                "url": "https://nssta.gov.in/training/res-94"
            },
            "comp_dpdpa_gov": {
                "course_id": "crs_tpac_01",
                "title": "National Statistical Governance, DPDPA 2023 & Open Data Dissemination",
                "provider": "TPAC",
                "mode": "Hybrid",
                "duration_hours": 12.0,
                "expected_gain": "+0.8 Level",
                "urgency": "Low",
                "url": "https://mospi.gov.in/tpac/gov-102"
            }
        }

        for gap_item in sorted_gaps:
            comp_id = gap_item["competency_id"]
            if gap_item["gap"] > 0.3 and comp_id in catalogue_map:
                info = dict(catalogue_map[comp_id])
                info["step"] = step_number
                info["target_competency"] = gap_item["name"]
                info["current_gap"] = gap_item["gap"]
                pathway.append(info)
                step_number += 1

        return pathway
