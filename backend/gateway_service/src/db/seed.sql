-- ============================================================================
-- SAKSHAM AI - Seed Data for Official Statistical System
-- Initial datasets for MoSPI, NSSTA, iGOT Karmayogi, and TPAC
-- ============================================================================

-- 1. ROLES
INSERT INTO roles (id, name, description, permissions) VALUES
('role_learner', 'Learner', 'Statistical Officer / Field Staff / Data Analyst undergoing upskilling and competency assessment', '["assessment:take", "course:enroll", "pathway:view", "profile:edit"]'::jsonb),
('role_trainer', 'Trainer/Admin', 'NSSTA Faculty / Subject Matter Specialist / Content Reviewer responsible for training content and assessment generation', '["doc:upload", "quiz:generate", "quiz:review", "quiz:publish", "analytics:view_dept"]'::jsonb),
('role_sysadmin', 'System_Admin', 'MoSPI Leadership & System Administrator with full oversight, RBAC governance, and external API sync controls', '["all", "system:configure", "sync:trigger", "rbac:manage", "analytics:workforce_full"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 2. USERS
-- Default passwords are bcrypt hashes of "Saksham@2026"
INSERT INTO users (id, full_name, email, password_hash, role_id, designation, department, cadre, educational_qualifications, work_experience_years, encrypted_national_id, avatar_url) VALUES
('usr_sso_01', 'Arjun Sharma, ISS', 'arjun.sharma@mospi.gov.in', '$2a$10$w1qFkX8c06D0aE9bBvH9x.r1sJ8sH2rR5kZ5l1G8bE9jK0aM2l3oK', 'role_learner', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'Indian Statistical Service (Grade IV)', '[{"degree": "M.Sc. Statistics", "institution": "Indian Statistical Institute (ISI) Kolkata", "year": 2019}, {"degree": "B.Sc. Mathematics & Statistics", "institution": "Delhi University", "year": 2017}]'::jsonb, 5.5, 'ENC_AES256_e8d89f81a742c019be7402847a', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('usr_trainer_01', 'Dr. Radhika Sen', 'radhika.sen@nssta.gov.in', '$2a$10$w1qFkX8c06D0aE9bBvH9x.r1sJ8sH2rR5kZ5l1G8bE9jK0aM2l3oK', 'role_trainer', 'Deputy Director & Senior Faculty', 'National Statistical Systems Training Academy (NSSTA)', 'Indian Statistical Service (Senior Time Scale)', '[{"degree": "Ph.D. Econometrics", "institution": "Jawaharlal Nehru University (JNU)", "year": 2014}, {"degree": "M.Stat", "institution": "ISI Delhi", "year": 2009}]'::jsonb, 14.0, 'ENC_AES256_b3190fc4a612140a12e109848c', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
('usr_admin_01', 'Rajesh K. Verma, ISS', 'rajesh.verma@mospi.gov.in', '$2a$10$w1qFkX8c06D0aE9bBvH9x.r1sJ8sH2rR5kZ5l1G8bE9jK0aM2l3oK', 'role_sysadmin', 'Deputy Director General (DDG)', 'Coordination & Administration Division, MoSPI', 'Indian Statistical Service (Higher Administrative Grade)', '[{"degree": "M.Sc. Mathematical Statistics", "institution": "IIT Kanpur", "year": 2000}]'::jsonb, 22.0, 'ENC_AES256_f9011ab7284901dc912a763011', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('usr_jso_02', 'Priya Deshmukh', 'priya.deshmukh@mospi.gov.in', '$2a$10$w1qFkX8c06D0aE9bBvH9x.r1sJ8sH2rR5kZ5l1G8bE9jK0aM2l3oK', 'role_learner', 'Junior Statistical Officer (JSO)', 'Survey Design and Research Division (SDRD)', 'Subordinate Statistical Service (SSS)', '[{"degree": "M.Sc. Applied Statistics", "institution": "Pune University", "year": 2022}]'::jsonb, 2.0, 'ENC_AES256_918239acde102381204018234a', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150')
ON CONFLICT (id) DO NOTHING;

-- 3. COMPETENCY DOMAINS
INSERT INTO competency_domains (id, code, name, description, icon_name, color_hex, weight) VALUES
('dom_stat_methods', 'STAT_METHODS', 'Statistical Methods & Survey Sampling', 'Sample design, stratification, estimation procedures, non-sampling error modeling, and survey weights', 'BarChart3', '#1D4ED8', 1.00),
('dom_nat_accounts', 'NAT_ACCOUNTS', 'National Accounts & Macro Indicators', 'GDP/GVA compilation under SNA 2008, Input-Output tables, CPI/WPI index numbers, and IIP calculation', 'TrendingUp', '#0D9488', 1.00),
('dom_digital_data', 'DIGITAL_DATA', 'Digital, Data Engineering & Modern AI', 'Python/R for official statistics, SQL database queries, CAPI/CWI mobile data systems, and ML data validation', 'Cpu', '#7C3AED', 1.00),
('dom_gov_ethics', 'GOV_ETHICS', 'Statistical Governance, DPDPA & UN FP', 'MoSPI dissemination standards, DPDPA data privacy, National Statistical Commission (NSC) rules, UN Fundamental Principles', 'ShieldCheck', '#EA580C', 0.90),
('dom_leadership', 'LEADERSHIP', 'Policy Advisory & Strategic Leadership', 'Translating statistical insights to evidence-based policies, survey field leadership, and multi-agency coordination', 'Users', '#0284C7', 0.85)
ON CONFLICT (id) DO NOTHING;

-- 4. COMPETENCIES
INSERT INTO competencies (id, domain_id, code, title, description, max_level, level_descriptors) VALUES
('comp_sampling', 'dom_stat_methods', 'STAT_SMP_01', 'Multi-Stage Stratified Sampling & Weight Calibration', 'Design of complex probability samples, selection of First Stage Units (FSUs), multiplier generation and weight calibration for NSS surveys.', 5, 
'{"1": "Understands basic SRS and stratified sampling concepts", "2": "Calculates standard sampling variances and design effects", "3": "Builds multi-stage stratified designs and multiplier formulas", "4": "Calibrates survey weights using post-stratification and GREG estimation", "5": "Formulates national-level master sample frames and methodology standards"}'::jsonb),

('comp_sna_accounts', 'dom_nat_accounts', 'NAT_ACC_01', 'System of National Accounts (SNA 2008) Compilation', 'Measurement of Gross Domestic Product (GDP), Gross Value Added (GVA), Supply-Use Tables (SUT), and financial balance sheets.', 5,
'{"1": "Familiar with production, expenditure, and income approaches to GDP", "2": "Compiles sectoral value added with GVA basic price adjustments", "3": "Constructs Supply-Use Tables (SUT) and reconciles discrepancy matrices", "4": "Incorporates MCA-21 company financial data into unorganized sector estimates", "5": "Designs macro-econometric sequence of accounts and institutional sector accounts"}'::jsonb),

('comp_index_numbers', 'dom_nat_accounts', 'NAT_IDX_02', 'CPI, WPI & IIP Index Number Methodology', 'Laspeyres, Paasche, and Fisher index formulation, item basket weighting, geometric mean item-level aggregation, and chained indices.', 5,
'{"1": "Computes elementary price relatives and base-weighted indices", "2": "Handles base year revisions and item imputation algorithms", "3": "Implements geometric Laspeyres indices and rural-urban aggregation", "4": "Applies hedonic quality adjustments and chained Fisher price indices", "5": "Leads national Expert Advisory Committees on Price Index formulation"}'::jsonb),

('comp_python_r_stats', 'dom_digital_data', 'DIG_PRG_01', 'Data Processing in Python & R for Official Surveys', 'Automated data cleaning, microdata tabulation, survey variance estimation packages (survey in R, statsmodels in Python), and reproducibility.', 5,
'{"1": "Writes basic data manipulation scripts in pandas/dplyr", "2": "Automates survey data validation checks and range test scripts", "3": "Builds complex multi-table joins, multiplier weighting, and automated tabulations", "4": "Deploys reproducible ETL pipelines and CAPI real-time data sync scripts", "5": "Architects enterprise cloud-native statistical processing platforms"}'::jsonb),

('comp_ai_microdata', 'dom_digital_data', 'DIG_AI_02', 'Machine Learning for Imputation & Outlier Detection', 'Application of random forests, k-NN imputation, automated logical validation rule-learning, and NLP entity matching in enterprise surveys.', 5,
'{"1": "Applies standard rule-based and donor imputation methods", "2": "Uses scikit-learn for outlier detection on enterprise survey microdata", "3": "Tunes multivariate imputation by chained equations (MICE) and tree models", "4": "Builds LLM-driven classification pipelines for NIC/NCO industrial code tagging", "5": "Sets national AI ethics and algorithmic governance guidelines in MoSPI"}'::jsonb),

('comp_dpdpa_gov', 'dom_gov_ethics', 'GOV_DPDPA_01', 'Digital Personal Data Protection (DPDPA) & Confidentiality', 'Compliance with DPDPA 2023, Statistical Confidentiality protocols, anonymization (k-anonymity, differential privacy), and data release policies.', 5,
'{"1": "Understands fundamental privacy concepts and MoSPI confidentiality mandate", "2": "Applies cell suppression and top-coding on tabular aggregates", "3": "Implements k-anonymity and l-diversity on survey public-use files (PUF)", "4": "Architects differential privacy engines for microdata release", "5": "Formulates national data governance and legal statutory data agreements"}'::jsonb),

('comp_policy_advisory', 'dom_leadership', 'LEAD_POL_01', 'Evidence-Based Policy Translation & Briefings', 'Synthesizing complex multi-round survey results into actionable policy briefs for NITI Aayog, PMO, and Central Ministries.', 5,
'{"1": "Drafts basic descriptive summary notes on survey findings", "2": "Identifies key statistical trends and cross-tabulation implications", "3": "Authoritative drafting of chapter summaries for Economic Survey and MoSPI reports", "4": "Presents high-level econometric simulations for inter-ministerial committees", "5": "Advises Union Cabinet on long-term statistical strategy and global statistical conventions"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. ROLE BENCHMARKS (Required levels for Senior Statistical Officer in NAD)
INSERT INTO role_competency_benchmarks (id, designation, department, competency_id, required_level, importance_weight) VALUES
('bm_sso_nad_01', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_sna_accounts', 4, 1.20),
('bm_sso_nad_02', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_index_numbers', 4, 1.10),
('bm_sso_nad_03', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_sampling', 3, 0.90),
('bm_sso_nad_04', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_python_r_stats', 4, 1.15),
('bm_sso_nad_05', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_ai_microdata', 3, 0.85),
('bm_sso_nad_06', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_dpdpa_gov', 4, 1.00),
('bm_sso_nad_07', 'Senior Statistical Officer (SSO)', 'National Accounts Division (NAD)', 'comp_policy_advisory', 3, 0.80)
ON CONFLICT (id) DO NOTHING;

-- 6. USER CURRENT COMPETENCY PROFILES (Arjun Sharma)
INSERT INTO user_competency_profiles (id, user_id, competency_id, current_level, confidence_score, last_assessed_at) VALUES
('ucp_arjun_01', 'usr_sso_01', 'comp_sna_accounts', 2.80, 0.85, CURRENT_TIMESTAMP),
('ucp_arjun_02', 'usr_sso_01', 'comp_index_numbers', 3.50, 0.90, CURRENT_TIMESTAMP),
('ucp_arjun_03', 'usr_sso_01', 'comp_sampling', 2.20, 0.75, CURRENT_TIMESTAMP),
('ucp_arjun_04', 'usr_sso_01', 'comp_python_r_stats', 2.40, 0.80, CURRENT_TIMESTAMP),
('ucp_arjun_05', 'usr_sso_01', 'comp_ai_microdata', 1.60, 0.65, CURRENT_TIMESTAMP),
('ucp_arjun_06', 'usr_sso_01', 'comp_dpdpa_gov', 3.80, 0.95, CURRENT_TIMESTAMP),
('ucp_arjun_07', 'usr_sso_01', 'comp_policy_advisory', 2.90, 0.70, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 7. EXTERNAL COURSES & WORKSHOPS (iGOT Karmayogi & NSSTA)
INSERT INTO external_courses (id, external_id, provider, title, description, category, domain_id, target_competencies, duration_hours, delivery_mode, venue_location, difficulty_level, enrollment_url, syllabus) VALUES
('crs_igot_01', 'IGOT-STAT-201', 'iGOT Karmayogi', 'Advanced National Accounts Compilation (SNA 2008 & 2025 Update)', 'Comprehensive e-learning module on Gross Value Added (GVA) calculation, Supply-Use Tables, and incorporation of digital economy transactions.', 'Macroeconomic Statistics', 'dom_nat_accounts', '[{"competency_id": "comp_sna_accounts", "gain": 1.2}]'::jsonb, 18.0, 'Online E-Learning', 'iGOT Online Portal', 'Advanced', 'https://igotkarmayogi.gov.in/course/igot-stat-201', '["Session 1: Production Boundary & Institutional Sectors", "Session 2: FISIM & Capital Consumption Estimation", "Session 3: SUT Balancing & Input-Output Matrices", "Session 4: Digital Platforms & Cryptocurrencies in SNA"]'::jsonb),

('crs_igot_02', 'IGOT-PY-301', 'iGOT Karmayogi', 'Statistical Computing with Python: Survey Data Wrangling & Variance Estimation', 'Hands-on practical course for Statistical Officers covering pandas, statsmodels, survey multipliers, and reproducible CAPI automated validation scripts.', 'Data Science & Automation', 'dom_digital_data', '[{"competency_id": "comp_python_r_stats", "gain": 1.4}, {"competency_id": "comp_ai_microdata", "gain": 0.8}]'::jsonb, 24.0, 'Online E-Learning', 'iGOT Online Portal', 'Intermediate', 'https://igotkarmayogi.gov.in/course/igot-py-301', '["Module 1: High-performance data structures in pandas", "Module 2: Handling complex NSSO raw microdata layouts", "Module 3: Linearization and Jackknife variance estimation", "Module 4: Writing unit tests for CAPI validation engines"]'::jsonb),

('crs_nssta_01', 'NSSTA-RES-88', 'NSSTA', 'Residential Workshop on Complex Survey Sampling & Multi-Stage Stratification', 'Intensive 5-day on-campus residential training at NSSTA Greater Noida focusing on NSS 80th Round sampling methodology, FSU/SSU selection, and calibration.', 'Survey Methodology', 'dom_stat_methods', '[{"competency_id": "comp_sampling", "gain": 1.5}]'::jsonb, 35.0, 'Residential Workshop', 'NSSTA Greater Noida Campus', 'Advanced', 'https://nssta.gov.in/training/res-88', '["Day 1: Sampling frames and UFS block updates", "Day 2: Multi-stage probability proportional to size (PPS) sampling", "Day 3: Post-stratification and GREG calibration weights", "Day 4: Non-sampling error audits and re-interview techniques", "Day 5: Field simulation and presentation of survey designs"]'::jsonb),

('crs_nssta_02', 'NSSTA-RES-94', 'NSSTA', 'Executive Workshop on Machine Learning & AI in Official Statistical Data Validation', 'Specialized hands-on residential lab on applying anomaly detection, random forests, and LLM classifiers to industrial and household survey validation.', 'Artificial Intelligence & Modern Tech', 'dom_digital_data', '[{"competency_id": "comp_ai_microdata", "gain": 1.6}, {"competency_id": "comp_python_r_stats", "gain": 0.6}]'::jsonb, 30.0, 'Residential Workshop', 'NSSTA Greater Noida Campus (AI Computing Lab)', 'Specialized', 'https://nssta.gov.in/training/res-94', '["Day 1: Microdata quality frameworks and automated edit rules", "Day 2: Tree-based imputation algorithms (MICE & Random Forests)", "Day 3: NLP classification of NIC-2008 5-digit trade descriptions", "Day 4: Explainable AI & bias auditing in official data", "Day 5: Final capstone project on ASI microdata"]'::jsonb),

('crs_tpac_01', 'TPAC-GOV-102', 'TPAC', 'National Statistical Governance, DPDPA 2023 & Open Data Dissemination Policy', 'Policy-level certification designed by the Training Policy Advisory Committee on statutory confidentiality, DPDP Act 2023 compliance, and Open Government Data (OGD) publishing.', 'Governance & Law', 'dom_gov_ethics', '[{"competency_id": "comp_dpdpa_gov", "gain": 0.8}, {"competency_id": "comp_policy_advisory", "gain": 0.5}]'::jsonb, 12.0, 'Hybrid', 'Virtual / MoSPI HQ Vigyan Bhawan', 'Intermediate', 'https://mospi.gov.in/tpac/gov-102', '["Unit 1: The Collection of Statistics Act & Legal Mandates", "Unit 2: DPDP Act 2023 provisions relevant to official surveys", "Unit 3: Microdata anonymization protocols & cell suppression", "Unit 4: MoSPI N-DAP dissemination portal standards"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 8. LEARNING HISTORY (Arjun Sharma)
INSERT INTO learning_history (id, user_id, course_id, enrollment_date, progress_percentage, status, pre_assessment_score, post_assessment_score, certificate_url, certificate_verification_code, completed_at) VALUES
('lh_arjun_01', 'usr_sso_01', 'crs_tpac_01', CURRENT_TIMESTAMP - INTERVAL '45 days', 100, 'Completed', 68.00, 92.00, 'https://mospi.gov.in/certs/cert_arjun_tpac102.pdf', 'VER-MOSPI-2026-9921', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('lh_arjun_02', 'usr_sso_01', 'crs_igot_02', CURRENT_TIMESTAMP - INTERVAL '20 days', 65, 'In_Progress', 54.00, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 9. UPLOADED DOCUMENTS (For AI RAG & Quiz Ingestion)
INSERT INTO uploaded_documents (id, uploader_id, title, file_name, file_path, file_type, file_size_bytes, chunks_count, vector_collection_name, competency_id, status, summary) VALUES
('doc_nss79_01', 'usr_trainer_01', 'National Sample Survey (NSS) 79th Round Instruction Manual: Sampling Design & Household Schedules', 'NSS_79th_Round_Manual.pdf', '/storage/docs/NSS_79th_Round_Manual.pdf', 'PDF', 4289120, 48, 'coll_nss79_sampling', 'comp_sampling', 'Indexed', 'Official MoSPI operational manual for NSS 79th Round detailing multi-stage stratified design, selection of Urban Frame Survey (UFS) blocks, household listing procedures, and estimation multipliers.'),
('doc_sna2008_02', 'usr_trainer_01', 'System of National Accounts 2008 & India Implementation Guidelines: Gross Value Added & SUT', 'SNA_2008_India_Handbook.pdf', '/storage/docs/SNA_2008_India_Handbook.pdf', 'PDF', 6842010, 72, 'coll_sna2008_gva', 'comp_sna_accounts', 'Indexed', 'Methodological handbook detailing compilation of GVA by economic activity, double deflation techniques, FISIM allocation across institutional sectors, and Supply-Use Table balance reconciliation.')
ON CONFLICT (id) DO NOTHING;

-- 10. QUIZZES & QUESTIONS
INSERT INTO quizzes (id, document_id, created_by, competency_id, title, description, difficulty_level, total_questions, time_limit_minutes, passing_score_percentage, is_published) VALUES
('qz_nss_sampling_01', 'doc_nss79_01', 'usr_trainer_01', 'comp_sampling', 'Assessment on Multi-Stage Stratified Sampling & Survey Multipliers', 'Evaluates technical proficiency in FSU selection, second-stage stratification of households, and multiplier weighting formula formulation.', 'Medium', 4, 10, 70, TRUE),
('qz_sna_accounts_01', 'doc_sna2008_02', 'usr_trainer_01', 'comp_sna_accounts', 'Diagnostic Assessment on SNA 2008 GVA & Supply-Use Tables', 'Tests understanding of basic price valuation, FISIM sectoring, double deflation, and balancing discrepancy matrices.', 'Hard', 4, 12, 70, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, source_citation, difficulty, competency_tag, order_index) VALUES
('qq_smp_01', 'qz_nss_sampling_01', 'In a two-stage stratified sampling design used in NSS socio-economic surveys, what constitutes the First Stage Unit (FSU) in rural and urban sectors respectively?', 'Rural: Households; Urban: Census Enumeration Blocks', 'Rural: Census Villages / Panchayats; Urban: Urban Frame Survey (UFS) Blocks', 'Rural: Districts; Urban: Municipal Wards', 'Rural: Agricultural Holdings; Urban: Commercial Establishments', 'B', 'Under standard NSS survey methodology, FSUs in the rural sector are census villages (or panchayat wards in selected areas), while in the urban sector FSUs are Urban Frame Survey (UFS) blocks.', 'NSS 79th Round Manual, Chapter 2 (Sample Design), Page 14', 'Easy', 'STAT_SMP_01', 1),

('qq_smp_02', 'qz_nss_sampling_01', 'When calibrating survey weights using Generalized Regression (GREG) estimation, what is the primary objective of auxiliary population benchmark totals?', 'To artificially eliminate all sampling errors regardless of sample size', 'To adjust design weights so that weighted sample totals of auxiliary variables exactly match known population benchmarks, reducing variance', 'To re-order questionnaire items based on respondent demographic status', 'To convert qualitative survey responses into categorical numerical values', 'B', 'GREG estimators incorporate auxiliary administrative or census totals to calibrate design weights, ensuring consistency with known population benchmarks and reducing sampling variance of target parameters.', 'Official Statistics Sampling Handbook, Section 4.3', 'Hard', 'STAT_SMP_01', 2),

('qq_smp_03', 'qz_nss_sampling_01', 'If a sample of $n$ FSUs is selected with Probability Proportional to Size with Replacement (PPSWR) from a stratum with measure of size $M_i$ and total size $M_0$, what is the inclusion probability of the $i$-th FSU?', '$p_i = M_i / M_0$', '$p_i = n \\cdot (M_i / M_0)$', '$p_i = (M_0 - M_i) / n$', '$p_i = \\sqrt{M_i / n}$', 'B', 'In PPS sampling of size $n$, the selection probability of unit $i$ in a single draw is $M_i / M_0$, and the inclusion probability across $n$ draws is $n \\times (M_i / M_0)$.', 'NSS 79th Round Manual, Annexure B (Multiplier Formulas)', 'Medium', 'STAT_SMP_01', 3),

('qq_smp_04', 'qz_nss_sampling_01', 'Which method is recommended by MoSPI for estimating sampling variance of ratio estimators in multi-stage surveys when analytical formulas are non-linear and intractable?', 'Simple random sample approximation', 'Linearized Taylor Series expansion or Jackknife repeated replications (JRR)', 'Ignoring second-stage cluster variance entirely', 'Multiplying variance by a constant arbitrary factor of 2.5', 'B', 'For complex non-linear ratio estimators, MoSPI survey practice employs either Taylor Series Linearization or sub-sample replication methods (Jackknife / BRR) to compute robust standard errors.', 'NSS Methodology Guidelines, Chapter 5', 'Medium', 'STAT_SMP_01', 4),

('qq_sna_01', 'qz_sna_accounts_01', 'Under the System of National Accounts (SNA 2008), how is Gross Value Added (GVA) at basic prices derived from Output at basic prices?', 'GVA at basic prices = Output at basic prices - Intermediate Consumption at purchasers prices', 'GVA at basic prices = Output at basic prices + Product Taxes - Product Subsidies', 'GVA at basic prices = GDP at market prices - Net Factor Income from Abroad', 'GVA at basic prices = Final Consumption Expenditure + Gross Capital Formation', 'A', 'By standard SNA 2008 definition, GVA at basic prices is equal to Gross Output measured at basic prices minus Intermediate Consumption measured at purchasers prices.', 'SNA 2008 Handbook, Chapter 6 (The Production Account)', 'Medium', 'NAT_ACC_01', 1),

('qq_sna_02', 'qz_sna_accounts_01', 'What is the correct treatment of Financial Intermediation Services Indirectly Measured (FISIM) in SNA 2008 compared to older 1968 standards?', 'FISIM is treated purely as intermediate consumption of a nominal fictitious sector without allocation', 'FISIM output is allocated as intermediate consumption to user industries or final consumption to households and government based on loan and deposit balances', 'FISIM is excluded entirely from the production boundary as a transfer payment', 'FISIM is recorded only in the financial account balance sheet', 'B', 'SNA 2008 mandates that FISIM generated by financial intermediaries be allocated across user industries (intermediate consumption) and final consumers (households/government final consumption), directly impacting GDP.', 'SNA 2008 Implementation Guide for India, Section 3.4', 'Hard', 'NAT_ACC_01', 2),

('qq_sna_03', 'qz_sna_accounts_01', 'In the compilation of constant price GDP, why is "Double Deflation" method preferred over "Single Indicator" deflation for manufacturing value added?', 'Double deflation deflates both gross output and intermediate inputs separately with their respective price deflators, preventing bias when input and output prices diverge', 'Double deflation doubles the nominal growth rate to account for informal enterprise activities', 'Double deflation requires only the Consumer Price Index (CPI) and ignores Producer Price Indices', 'Double deflation is computationally simpler and requires no input-output weights', 'A', 'Double deflation deflates gross output with output price index and intermediate consumption with an input price index. When input prices (e.g. imported petroleum) fluctuate differently from output prices, single deflation produces distorted GVA growth estimates.', 'National Accounts Division Technical Report on SUT & Deflators', 'Hard', 'NAT_ACC_01', 3),

('qq_sna_04', 'qz_sna_accounts_01', 'In a Supply-Use Table (SUT) matrix framework, what fundamental identity must hold for every product row at purchasers prices?', 'Total Supply (Domestic Output + Imports + Trade/Transport Margins + Taxes on Products) = Total Use (Intermediate Use + Final Consumption + Capital Formation + Exports)', 'Domestic Output = Exports + Imports', 'Gross Value Added = Taxes on Products - Subsidies', 'Total Supply = Gross Capital Formation only', 'A', 'In the SUT framework, Total Supply of each product at purchasers prices must identically equal Total Use (sum of intermediate consumption and all final use components) at purchasers prices.', 'National Accounts Statistics Compilation Guidelines, Chapter 9', 'Medium', 'NAT_ACC_01', 4)
ON CONFLICT (id) DO NOTHING;

-- 11. QUIZ ATTEMPT (Arjun Sharma sample history)
INSERT INTO quiz_attempts (id, user_id, quiz_id, score_percentage, total_correct, total_questions, time_spent_seconds, passed, user_answers, competency_gain) VALUES
('qa_arjun_01', 'usr_sso_01', 'qz_nss_sampling_01', 75.00, 3, 4, 380, TRUE, '{"qq_smp_01": "B", "qq_smp_02": "B", "qq_smp_03": "A", "qq_smp_04": "B"}'::jsonb, '{"comp_sampling": 0.25}'::jsonb)
ON CONFLICT (id) DO NOTHING;
