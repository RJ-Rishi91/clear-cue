import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'clearcue.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'Insurance VA Trainee',
      agency TEXT NOT NULL DEFAULT 'CoverDirect Agency',
      avatar TEXT NOT NULL DEFAULT 'avatar-1',
      created_at TEXT DEFAULT (datetime('now')),
      last_active TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      total_checked INTEGER DEFAULT 0,
      average_score INTEGER DEFAULT 0,
      flashcards_mastered INTEGER DEFAULT 0,
      memory_match_high_score INTEGER DEFAULT 0,
      pronunciation_checks_count INTEGER DEFAULT 0,
      pronunciation_avg_accuracy INTEGER DEFAULT 0,
      completed_scenario_ids TEXT DEFAULT '[]',
      streak_days INTEGER DEFAULT 1,
      last_active_date TEXT DEFAULT (date('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checked_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      timestamp TEXT NOT NULL,
      audience TEXT NOT NULL,
      channel TEXT NOT NULL,
      original_snippet TEXT NOT NULL,
      overall_score INTEGER NOT NULL,
      strongest_c TEXT NOT NULL,
      growth_c TEXT NOT NULL,
      full_data TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mock_calls (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      timestamp TEXT NOT NULL,
      character TEXT NOT NULL,
      gender TEXT NOT NULL,
      accent TEXT NOT NULL,
      tone TEXT NOT NULL,
      call_type TEXT NOT NULL,
      topic TEXT NOT NULL,
      topic_label TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      overall_score INTEGER NOT NULL,
      transcript TEXT NOT NULL,
      evaluation TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pronunciation_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      timestamp TEXT NOT NULL,
      target_text TEXT NOT NULL,
      recognized_text TEXT NOT NULL,
      accent TEXT NOT NULL,
      accuracy_score INTEGER NOT NULL,
      feedback TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_user_id ON checked_messages(user_id);
    CREATE INDEX IF NOT EXISTS idx_mock_calls_user_id ON mock_calls(user_id);
    CREATE INDEX IF NOT EXISTS idx_pronunciation_user_id ON pronunciation_records(user_id);
  `);

  // Seed default user if none exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const defaultUserId = 'usr_sarah_jenkins';
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, name, email, role, agency, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      defaultUserId,
      'sarah_jenkins',
      'Sarah Jenkins',
      'sarah.jenkins@coverdirect.com',
      'Insurance Operations Specialist (Commercial Lines VA)',
      'CoverDirect Agency US',
      'avatar-1'
    );

    const insertProgress = db.prepare(`
      INSERT INTO user_progress (
        user_id, total_checked, average_score, flashcards_mastered, 
        memory_match_high_score, pronunciation_checks_count, 
        pronunciation_avg_accuracy, completed_scenario_ids, streak_days, last_active_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProgress.run(
      defaultUserId,
      3,
      84,
      38,
      94,
      5,
      89,
      JSON.stringify(['carrier-loss-runs']),
      4,
      new Date().toISOString().split('T')[0]
    );

    const insertMsg = db.prepare(`
      INSERT INTO checked_messages (
        id, user_id, timestamp, audience, channel, original_snippet, 
        overall_score, strongest_c, growth_c, full_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMsg.run(
      'demo-1',
      defaultUserId,
      'Today, 8:45 AM',
      'client',
      'email',
      "I'll check and let you know.",
      78,
      'courteous',
      'concrete',
      JSON.stringify({ note: 'Initial baseline check' })
    );

    insertMsg.run(
      'demo-2',
      defaultUserId,
      'Yesterday, 3:15 PM',
      'carrier',
      'email',
      'Could you please confirm the loss runs so that I can bind coverage today?',
      92,
      'concise',
      'complete',
      JSON.stringify({ note: 'Carrier escalation email' })
    );

    const insertMockCall = db.prepare(`
      INSERT INTO mock_calls (
        id, user_id, timestamp, character, gender, accent, tone, call_type,
        topic, topic_label, duration_seconds, overall_score, transcript, evaluation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMockCall.run(
      'mock-sample-1',
      defaultUserId,
      new Date().toISOString(),
      'insured',
      'female',
      'us',
      'rude',
      'asking_update',
      'docs_request',
      'Documents Request (Missing Forms & Loss Runs)',
      145,
      88,
      JSON.stringify([
        { id: '1', speaker: 'ai', text: 'I submitted this three weeks ago! Why is my certificate still pending?', timestamp: '00:05' },
        { id: '2', speaker: 'user', text: 'Could you please allow me 2 minutes to pull up your file so that I can confirm where the holdup is?', timestamp: '00:15' }
      ]),
      JSON.stringify({
        overallScore: 88,
        grade: 'A',
        callDurationFormatted: '02:25',
        sevenCsBreakdown: {
          clarity: 90,
          conciseness: 85,
          concreteness: 88,
          correctness: 92,
          coherence: 86,
          completeness: 84,
          courtesy: 92,
        },
        goldenRulesEvaluation: {
          outcomeFirst: true,
          reasonAttached: true,
          actionTakenAhead: true,
          politeNotCommand: true,
          zeroBlame: true,
          noVagueWords: true,
        },
        areasOfStrength: [
          'De-escalated angry insured without deflecting blame to carrier',
          'Attached operational reason ("so that we can bind today")',
          'Provided exact deadline (3:00 PM EST)',
        ],
        areasForImprovement: [
          'Ensure initial greeting immediately identifies agency department',
        ],
        callManagementTips: [
          'Maintain steady pacing during high-conflict moments.',
        ],
        turnByTurnFeedback: [],
      })
    );
  }
}
