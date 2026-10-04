import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

let isMongoConnected = false;

export async function connectMongo(): Promise<boolean> {
  if (!MONGODB_URI) {
    console.log('ℹ️ MONGODB_URI not detected in environment. Using local SQLite persistent store.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected successfully to MongoDB Atlas!');
    return true;
  } catch (err: any) {
    console.warn('⚠️ MongoDB Atlas connection error:', err.message);
    console.log('ℹ️ Falling back to local persistent store.');
    isMongoConnected = false;
    return false;
  }
}

export function getIsMongoConnected(): boolean {
  return isMongoConnected;
}

// --------------------------------------------------------------------------
// Mongoose Models
// --------------------------------------------------------------------------

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true, default: '' },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'Insurance Operations Specialist (VA)' },
  accountRole: { type: String, enum: ['master', 'admin', 'teacher', 'user'], default: 'user' },
  agency: { type: String, default: 'CoverDirect Agency US' },
  avatar: { type: String, default: 'avatar-1' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalChecked: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  flashcardsMastered: { type: Number, default: 0 },
  memoryMatchHighScore: { type: Number, default: 0 },
  pronunciationChecksCount: { type: Number, default: 0 },
  pronunciationAvgAccuracy: { type: Number, default: 0 },
  completedScenarioIds: { type: [String], default: [] },
  streakDays: { type: Number, default: 1 },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  updatedAt: { type: Date, default: Date.now },
});

const CheckedMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  timestamp: { type: String, required: true },
  audience: { type: String, required: true },
  channel: { type: String, required: true },
  originalSnippet: { type: String, required: true },
  overallScore: { type: Number, required: true },
  strongestC: { type: String, required: true },
  growthC: { type: String, required: true },
  fullData: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const MockCallSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  timestamp: { type: String, required: true },
  character: { type: String, required: true },
  gender: { type: String, required: true },
  accent: { type: String, required: true },
  tone: { type: String, required: true },
  callType: { type: String, required: true },
  topic: { type: String, required: true },
  topicLabel: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  overallScore: { type: Number, required: true },
  transcript: { type: Array, default: [] },
  evaluation: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const PronunciationRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  timestamp: { type: String, required: true },
  targetText: { type: String, required: true },
  recognizedText: { type: String, required: true },
  accent: { type: String, required: true },
  accuracyScore: { type: Number, required: true },
  feedback: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);
export const MongoProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);
export const MongoCheckedMessage = mongoose.models.CheckedMessage || mongoose.model('CheckedMessage', CheckedMessageSchema);
export const MongoMockCall = mongoose.models.MockCall || mongoose.model('MockCall', MockCallSchema);
export const MongoPronunciation = mongoose.models.PronunciationRecord || mongoose.model('PronunciationRecord', PronunciationRecordSchema);
