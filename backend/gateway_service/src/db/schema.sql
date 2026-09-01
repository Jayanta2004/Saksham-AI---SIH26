-- ============================================================================
-- SAKSHAM AI - Skill Intelligence & Learning Platform
-- Database Schema (PostgreSQL DDL)
-- Target: India's Official Statistical System (MoSPI / NSSTA / iGOT Karmayogi)
-- ============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ROLES & ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. USERS (Officers, Trainers, System Administrators)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    designation VARCHAR(150) NOT NULL, -- e.g. Senior Statistical Officer (SSO), Junior Statistical Officer (JSO), Director
    department VARCHAR(150) NOT NULL, -- e.g. National Accounts Division (NAD), Survey Design & Research Division (SDRD), Field Operations Division (FOD), Central Statistics Office (CSO), Price Statistics Division (PSD)
    cadre VARCHAR(100) DEFAULT 'Indian Statistical Service (ISS) / SSS',
    educational_qualifications JSONB DEFAULT '[]'::jsonb, -- e.g. [{"degree": "M.Sc. Statistics", "institution": "ISI Kolkata", "year": 2018}]
    work_experience_years NUMERIC(4,1) DEFAULT 0.0,
    encrypted_national_id VARCHAR(500), -- AES-256 encrypted sensitive officer identifier
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- ----------------------------------------------------------------------------
-- 3. COMPETENCY FRAMEWORKS (Official Statistics Taxonomy)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS competency_domains (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL, -- Statistical Methods, National Accounts, Digital & Data Engineering, Official Statistical Governance & Ethics, Behavioural & Leadership
    description TEXT,
    icon_name VARCHAR(100),
    color_hex VARCHAR(20) DEFAULT '#1E40AF',
    weight NUMERIC(3,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencies (
    id VARCHAR(100) PRIMARY KEY,
    domain_id VARCHAR(50) NOT NULL REFERENCES competency_domains(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    max_level INT DEFAULT 5, -- Levels 1 (Beginner) to 5 (Expert/Authority)
    level_descriptors JSONB NOT NULL DEFAULT '{}'::jsonb, -- Description for each level 1..5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_competencies_domain_id ON competencies(domain_id);

-- Role-based baseline requirements for gap analysis
CREATE TABLE IF NOT EXISTS role_competency_benchmarks (
    id VARCHAR(100) PRIMARY KEY,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    competency_id VARCHAR(100) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    required_level INT NOT NULL CHECK (required_level BETWEEN 1 AND 5),
    importance_weight NUMERIC(3,2) DEFAULT 1.00,
    CONSTRAINT unique_role_comp UNIQUE (designation, department, competency_id)
);

-- Officer dynamic competency status
CREATE TABLE IF NOT EXISTS user_competency_profiles (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id VARCHAR(100) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    current_level NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (current_level >= 1.00 AND current_level <= 5.00),
    confidence_score NUMERIC(3,2) DEFAULT 0.50, -- 0.00 to 1.00
    last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_competency UNIQUE (user_id, competency_id)
);

CREATE INDEX IF NOT EXISTS idx_ucp_user_id ON user_competency_profiles(user_id);

-- ----------------------------------------------------------------------------
-- 4. EXTERNAL COURSES & WORKSHOPS (iGOT Karmayogi & NSSTA/TPAC)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS external_courses (
    id VARCHAR(100) PRIMARY KEY,
    external_id VARCHAR(100) NOT NULL, -- ID from iGOT or NSSTA
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('iGOT Karmayogi', 'NSSTA', 'TPAC', 'MoSPI In-House')),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    domain_id VARCHAR(50) REFERENCES competency_domains(id) ON DELETE SET NULL,
    target_competencies JSONB DEFAULT '[]'::jsonb, -- Array of competency IDs and target level gains
    duration_hours NUMERIC(5,1) DEFAULT 10.0,
    delivery_mode VARCHAR(50) DEFAULT 'Online E-Learning' CHECK (delivery_mode IN ('Online E-Learning', 'Residential Workshop', 'Hybrid', 'Virtual Instructor-Led')),
    venue_location VARCHAR(200), -- e.g. "NSSTA Greater Noida Campus"
    difficulty_level VARCHAR(50) DEFAULT 'Intermediate' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Specialized')),
    enrollment_url VARCHAR(500),
    syllabus JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_external_courses_provider ON external_courses(provider);

-- ----------------------------------------------------------------------------
-- 5. LEARNING HISTORY & COURSE ENROLLMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_history (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) NOT NULL REFERENCES external_courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(50) DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'In_Progress', 'Completed', 'Dropped')),
    pre_assessment_score NUMERIC(5,2),
    post_assessment_score NUMERIC(5,2),
    certificate_url VARCHAR(500),
    certificate_verification_code VARCHAR(100),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learning_history_user ON learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_status ON learning_history(status);

-- ----------------------------------------------------------------------------
-- 6. UPLOADED DOCUMENTS (PDF / PPT for RAG Ingestion)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploaded_documents (
    id VARCHAR(100) PRIMARY KEY,
    uploader_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    file_name VARCHAR(300) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF', 'PPT', 'PPTX', 'DOCX', 'TXT')),
    file_size_bytes BIGINT DEFAULT 0,
    chunks_count INT DEFAULT 0,
    vector_collection_name VARCHAR(150),
    competency_id VARCHAR(100) REFERENCES competencies(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Indexed' CHECK (status IN ('Uploaded', 'Processing', 'Indexed', 'Failed')),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. QUIZZES & MCQs (AI-Generated & Trainer-Published)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(100) PRIMARY KEY,
    document_id VARCHAR(100) REFERENCES uploaded_documents(id) ON DELETE SET NULL,
    created_by VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    competency_id VARCHAR(100) REFERENCES competencies(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50) DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard', 'Mixed')),
    total_questions INT DEFAULT 5,
    time_limit_minutes INT DEFAULT 10,
    passing_score_percentage INT DEFAULT 70,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(100) PRIMARY KEY,
    quiz_id VARCHAR(100) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(5) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT NOT NULL,
    source_citation TEXT, -- e.g. "Section 3.2, National Sample Survey 79th Round Manual"
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    competency_tag VARCHAR(100),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- ----------------------------------------------------------------------------
-- 8. QUIZ ATTEMPTS & PERFORMANCE RECORDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id VARCHAR(100) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score_percentage NUMERIC(5,2) NOT NULL,
    total_correct INT NOT NULL,
    total_questions INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    passed BOOLEAN NOT NULL,
    user_answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"q1": "A", "q2": "C"}
    competency_gain JSONB DEFAULT '{}'::jsonb, -- e.g. {"comp_sampling": 0.35}
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS (Security, Syncs, Compliance)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
