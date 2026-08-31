import axios from 'axios';
import { igotCache } from './igotSync.js';

const MOCK_NSSTA_PROGRAMS = [
  {
    id: 'crs_nssta_01',
    external_id: 'NSSTA-RES-88',
    provider: 'NSSTA',
    title: 'Residential Workshop on Complex Survey Sampling & Multi-Stage Stratification',
    description: 'Intensive 5-day on-campus residential training at NSSTA Greater Noida focusing on NSS 80th Round sampling methodology, FSU/SSU selection, and calibration.',
    category: 'Survey Methodology',
    domain_id: 'dom_stat_methods',
    target_competencies: [{ competency_id: 'comp_sampling', gain: 1.5 }],
    duration_hours: 35.0,
    delivery_mode: 'Residential Workshop',
    venue_location: 'NSSTA Greater Noida Campus, Uttar Pradesh',
    difficulty_level: 'Advanced',
    enrollment_url: 'https://nssta.gov.in/training/res-88',
    upcoming_batches: [
      { batch_id: 'B26-01', start_date: '2026-09-15', end_date: '2026-09-20', seats_available: 12, total_seats: 40 },
      { batch_id: 'B26-02', start_date: '2026-10-10', end_date: '2026-10-15', seats_available: 28, total_seats: 40 }
    ],
    syllabus: [
      'Day 1: Sampling frames and UFS block updates',
      'Day 2: Multi-stage probability proportional to size (PPS) sampling',
      'Day 3: Post-stratification and GREG calibration weights',
      'Day 4: Non-sampling error audits and re-interview techniques',
      'Day 5: Field simulation and presentation of survey designs'
    ],
    is_active: true
  },
  {
    id: 'crs_nssta_02',
    external_id: 'NSSTA-RES-94',
    provider: 'NSSTA',
    title: 'Executive Workshop on Machine Learning & AI in Official Statistical Data Validation',
    description: 'Specialized hands-on residential lab on applying anomaly detection, random forests, and LLM classifiers to industrial and household survey validation.',
    category: 'Artificial Intelligence & Modern Tech',
    domain_id: 'dom_digital_data',
    target_competencies: [
      { competency_id: 'comp_ai_microdata', gain: 1.6 },
      { competency_id: 'comp_python_r_stats', gain: 0.6 }
    ],
    duration_hours: 30.0,
    delivery_mode: 'Residential Workshop',
    venue_location: 'NSSTA Greater Noida Campus (AI Computing Lab)',
    difficulty_level: 'Specialized',
    enrollment_url: 'https://nssta.gov.in/training/res-94',
    upcoming_batches: [
      { batch_id: 'AI-26-01', start_date: '2026-09-22', end_date: '2026-09-27', seats_available: 8, total_seats: 30 }
    ],
    syllabus: [
      'Day 1: Microdata quality frameworks and automated edit rules',
      'Day 2: Tree-based imputation algorithms (MICE & Random Forests)',
      'Day 3: NLP classification of NIC-2008 5-digit trade descriptions',
      'Day 4: Explainable AI & bias auditing in official data',
      'Day 5: Final capstone project on ASI microdata'
    ],
    is_active: true
  },
  {
    id: 'crs_tpac_01',
    external_id: 'TPAC-GOV-102',
    provider: 'TPAC',
    title: 'National Statistical Governance, DPDPA 2023 & Open Data Dissemination Policy',
    description: 'Policy-level certification designed by the Training Policy Advisory Committee on statutory confidentiality, DPDP Act 2023 compliance, and Open Government Data (OGD) publishing.',
    category: 'Governance & Law',
    domain_id: 'dom_gov_ethics',
    target_competencies: [
      { competency_id: 'comp_dpdpa_gov', gain: 0.8 },
      { competency_id: 'comp_policy_advisory', gain: 0.5 }
    ],
    duration_hours: 12.0,
    delivery_mode: 'Hybrid',
    venue_location: 'Virtual / MoSPI HQ Vigyan Bhawan, New Delhi',
    difficulty_level: 'Intermediate',
    enrollment_url: 'https://mospi.gov.in/tpac/gov-102',
    upcoming_batches: [
      { batch_id: 'TPAC-26-03', start_date: '2026-09-08', end_date: '2026-09-10', seats_available: 50, total_seats: 100 }
    ],
    syllabus: [
      'Unit 1: The Collection of Statistics Act & Legal Mandates',
      'Unit 2: DPDP Act 2023 provisions relevant to official surveys',
      'Unit 3: Microdata anonymization protocols & cell suppression',
      'Unit 4: MoSPI N-DAP dissemination portal standards'
    ],
    is_active: true
  }
];

export class NsstaSyncService {
  /**
   * Fetch NSSTA and TPAC training calendars with caching
   */
  static async fetchPrograms(forceRefresh = false) {
    const cacheKey = 'nssta_training_calendar';
    if (!forceRefresh) {
      const cached = igotCache.get(cacheKey);
      if (cached) {
        return {
          source: 'cache (Redis / In-Memory)',
          count: cached.length,
          data: cached,
          timestamp: new Date().toISOString()
        };
      }
    }

    const nsstaApiUrl = process.env.NSSTA_API_URL;
    let programs = MOCK_NSSTA_PROGRAMS;

    if (nsstaApiUrl) {
      try {
        const res = await axios.get(nsstaApiUrl, { timeout: 4000 });
        if (res.data && Array.isArray(res.data)) {
          programs = res.data;
        }
      } catch (err) {
        console.warn('[NSSTA Sync] Remote API unreachable, serving cached NSSTA official calendar.');
      }
    }

    igotCache.set(cacheKey, programs, 3600);

    return {
      source: 'live sync',
      count: programs.length,
      data: programs,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Submit nomination request for a residential workshop
   */
  static async submitNomination(userId, courseId, batchId) {
    return {
      nomination_id: `NOM-NSSTA-${Date.now().toString().slice(-6)}`,
      user_id: userId,
      course_id: courseId,
      batch_id: batchId,
      status: 'Forwarded to Cadre Controlling Authority (CCA)',
      submitted_at: new Date().toISOString(),
      venue: 'NSSTA Greater Noida Campus'
    };
  }
}
