import pg from 'pg';
import dotenv from 'dotenv';
import { db as memoryDb } from './inMemoryDb.js';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool Setup
const databaseUrl = process.env.DATABASE_URL || process.env.PG_DATABASE_URL;

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'saksham_ai',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

let isPostgresConnected = false;

// Initialize & Test Connection
export const initPostgres = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isPostgresConnected = true;
    console.log('connected to postgres db');
  } catch (err) {
    isPostgresConnected = false;
    console.warn(`db connection issue (${err.message}), using fallback store`);
  }
};

// PostgreSQL Query Executor with Fallback
export const pgDb = {
  isPostgresActive: () => isPostgresConnected,
  getPool: () => pool,

  getUserByEmail: async (email) => {
    if (isPostgresConnected) {
      try {
        const res = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getUserByEmail: ${err.message}`);
      }
    }
    return memoryDb.getUserByEmail(email);
  },

  getUserById: async (id) => {
    if (isPostgresConnected) {
      try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getUserById: ${err.message}`);
      }
    }
    return memoryDb.getUserById(id);
  },

  getUserCompetencies: async (userId) => {
    if (isPostgresConnected) {
      try {
        const query = `
          SELECT 
            c.id AS competency_id,
            c.title AS competency_name,
            c.code AS competency_code,
            d.name AS domain_name,
            COALESCE(ucp.current_level, 1.5) AS current_level,
            COALESCE(rcb.required_level, 3.5) AS required_level,
            COALESCE(rcb.importance_weight, 1.00) AS weight
          FROM competencies c
          JOIN competency_domains d ON c.domain_id = d.id
          LEFT JOIN user_competency_profiles ucp ON ucp.competency_id = c.id AND ucp.user_id = $1
          LEFT JOIN users u ON u.id = $1
          LEFT JOIN role_competency_benchmarks rcb ON rcb.competency_id = c.id AND rcb.designation = u.designation AND rcb.department = u.department
          ORDER BY c.created_at;
        `;
        const res = await pool.query(query, [userId]);
        if (res.rows.length > 0) {
          const compsMap = {};
          res.rows.forEach((r) => {
            compsMap[r.competency_id] = parseFloat(r.current_level) || 1.5;
            compsMap[r.competency_code] = parseFloat(r.current_level) || 1.5;
          });
          return compsMap;
        }
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getUserCompetencies: ${err.message}`);
      }
    }
    return memoryDb.getUserCompetencies(userId);
  },

  updateUserCompetency: async (userId, competencyCode, newScore) => {
    if (isPostgresConnected) {
      try {
        const query = `
          INSERT INTO user_competency_profiles (id, user_id, competency_id, current_level, last_assessed_at, updated_at)
          SELECT 'ucp_' || substr(md5(random()::text), 1, 10), $1, c.id, $2, NOW(), NOW()
          FROM competencies c WHERE c.code = $3 OR c.id = $3
          ON CONFLICT (user_id, competency_id) 
          DO UPDATE SET current_level = EXCLUDED.current_level, updated_at = NOW();
        `;
        await pool.query(query, [userId, newScore, competencyCode]);
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] updateUserCompetency: ${err.message}`);
      }
    }
    return memoryDb.updateUserCompetency(userId, competencyCode, newScore);
  },

  getAllCourses: async () => {
    if (isPostgresConnected) {
      try {
        const res = await pool.query('SELECT * FROM courses WHERE is_published = true ORDER BY created_at DESC');
        if (res.rows.length > 0) return res.rows;
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getAllCourses: ${err.message}`);
      }
    }
    return [
      {
        id: 'crs_ml_01',
        title: 'Machine Learning & AI Fundamentals for Microdata Analysis',
        provider: 'iGOT Karmayogi',
        domain_tag: 'Technical Competencies',
        duration_hours: 6,
        difficulty: 'Intermediate'
      },
      {
        id: 'crs_dpdp_02',
        title: 'Digital Personal Data Protection (DPDP) Act 2023 Implementation',
        provider: 'NeGD / MeitY',
        domain_tag: 'Digital Governance',
        duration_hours: 4,
        difficulty: 'Beginner'
      }
    ];
  },

  getQuizzes: async () => {
    if (isPostgresConnected) {
      try {
        const res = await pool.query('SELECT * FROM quizzes WHERE is_published = true ORDER BY created_at DESC');
        if (res.rows.length > 0) return res.rows;
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getQuizzes: ${err.message}`);
      }
    }
    return memoryDb.quizzes;
  },

  getAllUsers: async () => {
    if (isPostgresConnected) {
      try {
        const res = await pool.query(`
          SELECT u.id, u.full_name, u.email, u.role_id, COALESCE(r.name, u.role_id) AS role_name, u.designation, u.department, u.cadre, u.is_active 
          FROM users u 
          LEFT JOIN roles r ON u.role_id = r.id 
          ORDER BY u.full_name ASC
        `);
        if (res.rows.length > 0) return res.rows;
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getAllUsers: ${err.message}`);
      }
    }
    return memoryDb.users;
  },

  createUser: async (newUser) => {
    if (isPostgresConnected) {
      try {
        const query = `
          INSERT INTO users (id, role_id, full_name, email, password_hash, designation, department, cadre, encrypted_national_id, avatar_url, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `;
        const res = await pool.query(query, [
          newUser.id,
          newUser.role_id,
          newUser.full_name,
          newUser.email,
          newUser.password_hash,
          newUser.designation,
          newUser.department,
          newUser.cadre,
          newUser.encrypted_national_id,
          newUser.avatar_url,
          newUser.is_active,
        ]);
        return res.rows[0];
      } catch (err) {
        console.warn(`[PostgreSQL Query Note] createUser: ${err.message}`);
      }
    }
    return newUser;
  },

  updateUserPassword: async (email, passwordHash) => {
    if (isPostgresConnected) {
      try {
        await pool.query('UPDATE users SET password_hash = $1 WHERE LOWER(email) = LOWER($2)', [passwordHash, email]);
        return true;
      } catch (err) {
        console.warn(`[PostgreSQL Query Note] updateUserPassword: ${err.message}`);
      }
    }
    return true;
  },

  saveAttempt: async (attempt) => {
    if (isPostgresConnected) {
      try {
        const query = `
          INSERT INTO quiz_attempts (id, user_id, quiz_id, score_percentage, total_correct, total_questions, time_spent_seconds, passed, attempted_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW());
        `;
        await pool.query(query, [
          attempt.id,
          attempt.user_id,
          attempt.quiz_id,
          attempt.score_percentage,
          attempt.total_correct || 0,
          attempt.total_questions || 4,
          attempt.time_spent_seconds || 180,
          attempt.passed
        ]);
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] saveAttempt: ${err.message}`);
      }
    }
    return memoryDb.saveAttempt(attempt);
  },

  getUserCertificates: async (userId) => {
    if (isPostgresConnected) {
      try {
        const query = `
          SELECT qa.id, qa.score_percentage, qa.attempted_at, q.title as quiz_title, u.full_name as recipient_name, u.designation as recipient_designation, u.department
          FROM quiz_attempts qa
          JOIN quizzes q ON qa.quiz_id = q.id
          JOIN users u ON qa.user_id = u.id
          WHERE qa.user_id = $1 AND qa.passed = true
          ORDER BY qa.attempted_at DESC;
        `;
        const res = await pool.query(query, [userId]);
        if (res.rows.length > 0) {
          return res.rows.map((r, idx) => ({
            id: `cert_${r.id}`,
            title: r.quiz_title || 'Certificate of Statistical Competency',
            issuer: 'Ministry of Statistics & Programme Implementation & NSSTA',
            issue_date: new Date(r.attempted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            score_percentage: parseFloat(r.score_percentage) || 75.0,
            credential_id: `SAKSHAM-${userId.slice(-6).toUpperCase()}-${r.id.slice(-6).toUpperCase()}-${idx + 101}`,
            recipient_name: r.recipient_name,
            recipient_designation: r.recipient_designation,
            department: r.department,
            skills_covered: ['Survey Sampling', 'Data Validation', 'Official Statistics Standards'],
            status: 'Verified & Active'
          }));
        }
      } catch (err) {
        console.warn(`[PostgreSQL Query Error] getUserCertificates: ${err.message}`);
      }
    }
    return memoryDb.getUserCertificates(userId);
  },

  getUserStats: async (userId) => {
    return memoryDb.getUserStats(userId);
  },

  getUserTrajectory: async (userId) => {
    return memoryDb.getUserTrajectory(userId);
  }
};
