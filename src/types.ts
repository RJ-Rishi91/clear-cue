export type AccountRole = 'master' | 'admin' | 'teacher' | 'user';

export type NavView = 
  | 'home' 
  | 'seven-cs' 
  | 'check' 
  | 'draft-email' 
  | 'pronunciation' 
  | 'flashcards' 
  | 'mock-calls'
  | 'practice' 
  | 'progress' 
  | 'about'
  | 'master-panel'
  | 'admin-panel'
  | 'teacher-panel';

export type SevenCKey =
  | 'clear'
  | 'concise'
  | 'concrete'
  | 'correct'
  | 'coherent'
  | 'complete'
  | 'courteous';

// Expanded audience taxonomy matching user instructions
export type Audience =
  | 'agency_owner'     // Agency Owners — Your Primary Client
  | 'their_customer'   // Their Customers — End Clients You May Support Directly
  | 'partner_org'      // Partner Organizations — Outside Companies (Carriers, Adjusters)
  | 'internal_team'    // Internal Colleagues & Shift Handovers
  // Backwards compatibility aliases
  | 'client'
  | 'carrier'
  | 'insured'
  | 'adjuster'
  | 'manager';

export type CommunicationTone =
  | 'friendly'
  | 'professional'
  | 'casual_professional'
  | 'building_rapport';

export type CommunicationPurpose =
  | 'update'
  | 'request'
  | 'confirmation'
  | 'clarification'
  | 'asking_info';

export type Channel =
  | 'email'
  | 'chat'
  | 'endorsement_note'
  | 'claims_status'
  | 'carrier_followup'
  | 'renewal_notice';

export interface SevenCPrinciple {
  key: SevenCKey;
  name: string;
  shortDesc: string;
  insuranceImpact: string;
  commonPitfalls: string[];
  badExample: string;
  badExplanation: string;
  goodExample: string;
  goodExplanation: string;
  improvementDelta: number;
  deltaLabel: string;
  actionChecklist: string[];
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  audience: string;
  original: string;
  highlightC: string;
  scoreGain: number;
  gainLabel: string;
  improved: string;
  explanation: string;
}

export interface ImprovementItem {
  category: string;
  original: string;
  suggestion: string;
  reason: string;
}

export interface AudienceFit {
  rating: string;
  tone: string;
  analysis: string;
}

export interface MessageAnalysisResult {
  overallScore: number;
  scores: Record<SevenCKey, number>;
  improvedMessage: string;
  improvements: ImprovementItem[];
  audienceFit: AudienceFit;
  keyTakeaways: string[];
  checks: {
    hasTimeline: boolean;
    hasReference: boolean;
    hasCourtesy: boolean;
    isConcise: boolean;
    isPoliteRequestNotCommand: boolean;
    isNonBlamingAndNeutral: boolean;
    hasNoVagueQuantifiers: boolean;
    // New Golden Rules
    hasOutcomeFirst: boolean;
    hasReasonOrImpact: boolean;
    hasActionTakenAndAhead: boolean;
  };
  engine?: string;
}

export interface PracticeScenario {
  id: string;
  title: string;
  audience: Audience;
  audienceLabel: string;
  category: string;
  difficulty: 'Foundational' | 'Intermediate' | 'High Stakes';
  context: string;
  incomingMessage: string;
  fromName: string;
  goal: string;
  keyPointsToInclude: string[];
  starterDraft: string;
  exemplarResponse: string;
}

export interface PracticeEvaluationResult {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  modelAnswerTip: string;
}

export interface CheckedMessageRecord {
  id: string;
  timestamp: string;
  audience: Audience;
  channel: Channel;
  originalSnippet: string;
  overallScore: number;
  strongestC: SevenCKey;
  growthC: SevenCKey;
  fullData?: MessageAnalysisResult;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
  accountRole?: AccountRole;
  agency: string;
  avatar: string;
  created_at?: string;
  last_active?: string;
  total_checked?: number;
  average_score?: number;
  streak_days?: number;
}

export interface UserProgressData {
  totalChecked: number;
  averageScore: number;
  history: CheckedMessageRecord[];
  completedScenarioIds: string[];
  streakDays: number;
  lastActiveDate: string;
  // Extended progress tracking
  flashcardsMastered?: number;
  memoryMatchHighScore?: number;
  pronunciationChecksCount?: number;
  pronunciationAvgAccuracy?: number;
  mockCallHistory?: MockCallRecord[];
  pronunciationAttempts?: number;
  pronunciationAverageScore?: number;
  reviewedFlashcardIds?: string[];
  areasOfStrength?: string[];
  areasForImprovement?: string[];
}

// Mail Writer feature
export interface EmailDraftRequest {
  topic: string;
  tone: CommunicationTone;
  purpose: CommunicationPurpose;
  audience: Audience;
  form: string;
  contextDetails?: string;
}

export interface EmailDraftResponse {
  subject: string;
  body: string;
  explanation: string;
  rulesHonored: string[];
  actionTaken?: string;
  actionAhead?: string;
  engine?: string;
}

// Pronunciation Check Feature
export type AccentType = 'us' | 'uk' | 'ca';

export interface AccentProfile {
  id: AccentType;
  name: string;
  country: string;
  flag: string;
  locale: string;
  summary: string;
  keyPhoneticRules: string[];
  youtubeReferences: Array<{
    title: string;
    url: string;
    keyTakeaway: string;
  }>;
}

export interface WordPronunciationFeedback {
  word: string;
  targetIpa: string;
  status: 'correct' | 'near' | 'missed';
  tip?: string;
}

export interface PronunciationEvaluation {
  accuracyScore: number;
  recognizedText: string;
  targetText: string;
  accent: AccentType;
  words: WordPronunciationFeedback[];
  accentSpecificFeedback: string[];
  waysToFix: Array<{
    feature: string;
    explanation: string;
    practiceDrill: string;
  }>;
  overallAssessment: string;
}

// Flashcard & Vocabulary Categories from PDF Handout & Insurance Library
export type FlashcardCategory =
  | 'all'
  | 'key_parties'
  | 'policy_documents'
  | 'policy_lifecycle'
  | 'financial_parties'
  | 'coverage_concepts'
  | 'billing_methods'
  | 'business_operations'
  | 'insurance_claims'
  | 'customer_service'
  | 'workplace_life'
  | 'people_social'
  | 'problems_decisions'
  | 'tech_systems'
  | 'meetings_collab'
  | 'emotions_behavior'
  | 'explanation_sequencing'
  | 'uncertainty'
  | 'us_phrases'
  | 'uk_phrases'
  | 'corporate_phrases'
  | 'corporate_acronyms'
  | 'sentence_starters';

export interface FlashcardCategoryInfo {
  id: FlashcardCategory;
  title: string;
  shortLabel: string;
  iconName: string;
  description: string;
  count: number;
}

export interface FlashcardItem {
  id: string;
  term: string;
  category: FlashcardCategory;
  categoryLabel?: string;
  collocation?: string;
  phonetic: string;
  iconName: string;
  meaning: string;
  usage: string;
  contextTip: string;
}

export interface MemoryGameCard {
  id: string; // unique card instance id
  pairId: string; // matches term id
  type: 'term' | 'meaning';
  content: string;
  subContent?: string;
  iconName: string;
  category: FlashcardCategory;
  isFlipped: boolean;
  isMatched: boolean;
}

// Mock Calls with AI
export type MockCallCharacter = 'client' | 'insured' | 'carrier' | 'poc';
export type MockCallGender = 'male' | 'female';
export type MockCallTone = 'polite' | 'rude' | 'normal';
export type MockCallType = 
  | 'instructions_delivery' 
  | 'asking_update' 
  | 'escalation'
  | 'task_assignment'
  | 'weekly_update'
  | 'feedback'
  | 'policy_query'
  | 'quote'
  | 'documentation'
  | 'claim'
  | 'renewal'
  | 'carrier_coordination';

export type MockCallCategory = 
  | 'task_assignment'
  | 'weekly_update'
  | 'feedback'
  | 'carrier'
  | 'insured'
  | 'cross_character';

export interface ScenarioData {
  clientName?: string;
  agency?: string;
  vaRole?: string;
  tasks?: string[];
  deadlines?: string;
  documents?: string;
  company?: string;
  policyNumber?: string;
  revenue?: string;
  issueDetails?: string;
  carrierName?: string;
  insuredName?: string;
  extraContext?: string;
}

export interface ScenarioDefinition {
  id: string;
  category: MockCallCategory;
  categoryTitle: string;
  title: string;
  scenarioCode: string;
  character: MockCallCharacter;
  characterTitle: string;
  tone: MockCallTone;
  callType: string;
  objective: string;
  scenarioData: ScenarioData;
  aiObjective: string;
  expectedBehaviours: string[];
  initialOpeningLine: string;
  rulesTested: string[];
  referenceDialogue: Array<{ speaker: 'ai' | 'user'; text: string }>;
  stages?: Array<{ stageName: string; character: MockCallCharacter; instructions: string }>;
}

export type MockCallTopic = 
  | 'policy_quote' 
  | 'noc_creation' 
  | 'docs_request' 
  | 'claim_verification' 
  | 'policy_issuance' 
  | 'status_update'
  | 'escalated_delay';

export interface MockCallTurn {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface MockCallEvaluation {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'Needs Practice';
  callDurationFormatted: string;
  sevenCsBreakdown: {
    clarity: number;
    conciseness: number;
    concreteness: number;
    correctness: number;
    coherence: number;
    completeness: number;
    courtesy: number;
  };
  goldenRulesEvaluation: {
    outcomeFirst: boolean;
    reasonAttached: boolean;
    actionTakenAhead: boolean;
    politeNotCommand: boolean;
    zeroBlame: boolean;
    noVagueWords: boolean;
  };
  areasOfStrength: string[];
  areasForImprovement: string[];
  callManagementTips: string[];
  turnByTurnFeedback: Array<{
    userTurnSnippet: string;
    critique: string;
    improvedVersion: string;
  }>;
}

export interface MockCallRecord {
  id: string;
  timestamp: string;
  character: MockCallCharacter;
  gender: MockCallGender;
  accent: AccentType;
  tone: MockCallTone;
  callType: MockCallType;
  topic: MockCallTopic;
  topicLabel: string;
  durationSeconds: number;
  overallScore: number;
  transcript: MockCallTurn[];
  evaluation: MockCallEvaluation;
}

