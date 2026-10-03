import React, { useState } from 'react';
import { UserProgressData, NavView, CheckedMessageRecord, MockCallRecord } from '../types';
import { MrCuckoo } from './MrCuckoo';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  RotateCcw, 
  Layers,
  Download,
  Printer,
  AlertCircle,
  ThumbsUp,
  PhoneCall,
  Headphones,
  Gamepad2,
  FileText,
  BarChart3,
  Calendar,
  User,
  ArrowRight,
  Check,
  Database,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProgressViewProps {
  progress: UserProgressData;
  onNavigate: (view: NavView, payload?: any) => void;
  onResetProgress: () => void;
  currentUser?: UserProfile;
  onOpenProfileModal?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onNavigate,
  onResetProgress,
  currentUser,
  onOpenProfileModal,
}) => {
  const [traineeName, setTraineeName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedMockCall, setSelectedMockCall] = useState<MockCallRecord | null>(null);
  const [selectedCheckedMsg, setSelectedCheckedMsg] = useState<CheckedMessageRecord | null>(null);

  React.useEffect(() => {
    if (currentUser?.name) {
      setTraineeName(currentUser.name);
    }
  }, [currentUser]);

  // Compute aggregated stats
  const totalChecks = progress.totalChecked;
  const avgMessageScore = progress.averageScore || 0;

  const mockCalls = progress.mockCallHistory || [];
  const totalMockCalls = mockCalls.length;
  const avgMockCallScore = totalMockCalls > 0
    ? Math.round(mockCalls.reduce((acc, c) => acc + c.overallScore, 0) / totalMockCalls)
    : 0;

  const flashcardsMastered = progress.flashcardsMastered || 0;
  const memoryHighScore = progress.memoryMatchHighScore || 0;

  // Derive dynamic AOS (Areas of Strength) and AOI (Areas for Improvement)
  const defaultAos: string[] = [
    'Courteous Inquiries: Consistently framing requests with "Could you please..."',
    'Emotional Composure: Zero blame deflection when dealing with difficult clients',
    'Insurance Vocabulary: High recall of industry acronyms (ACORD, NOC, COI, SOV)',
    'Outcome-First Structure: Leading with the primary bottom-line update',
  ];

  const defaultAoi: string[] = [
    'Attach Operational Reason: Ensure every request explains "...so that [impact]"',
    'Dual-Phase Status Updates: Consistently provide both Action Taken and Action Ahead',
    'Eliminate Vague Quantifiers: Replace words like "asap", "soon", and "a few" with concrete timestamps',
    'Accent Nuance: Practice Flap T [ɾ] in US and drop post-vocalic R in UK',
  ];

  // If history exists, adjust AOS and AOI dynamically
  const calculatedAos = [...defaultAos];
  const calculatedAoi = [...defaultAoi];

  if (avgMessageScore >= 80) {
    calculatedAos.push(`Message Quality Standard: High average evaluation score (${avgMessageScore}%)`);
  } else if (avgMessageScore > 0 && avgMessageScore < 75) {
    calculatedAoi.push(`Written Drafting: Review 7 Cs rules to raise average score above 80%`);
  }

  if (totalMockCalls > 0 && avgMockCallScore >= 80) {
    calculatedAos.push(`Voice Simulation: Strong de-escalation in AI Mock Calls (${avgMockCallScore}%)`);
  }

  // Trigger browser print for PDF export
  const handleDownloadReport = () => {
    window.print();
  };

  const getReadinessGrade = () => {
    const combinedScore = (avgMessageScore * 0.5) + (avgMockCallScore * 0.5);
    if (combinedScore >= 88) return { grade: 'A+', label: 'Client-Facing Certified', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (combinedScore >= 78) return { grade: 'A', label: 'Workplace Ready', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (combinedScore >= 68) return { grade: 'B', label: 'Developing Competency', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    return { grade: 'In Training', label: 'Active L&D Progression', color: 'text-amber-700 bg-amber-100 border-amber-300' };
  };

  const readiness = getReadinessGrade();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-6 px-4">
      {/* Printable Report Header (Visible only when printing) */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ClearCue Professional Competency Report</h1>
            <p className="text-xs text-slate-600">Training Needs & Performance Capability Assessment</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Candidate: {traineeName}</p>
            <p className="text-slate-500">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              L&D Capability Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">BPO & Insurance Communication</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Trainee Progression Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor where you have worked, identify key Areas of Strength (AOS), target Areas for Improvement (AOI), and export your accredited communication report.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (PDF)</span>
          </button>
          <button
            onClick={onResetProgress}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Reset training telemetry"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Executive Summary & Readiness Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span className="text-lg font-bold text-slate-900">{traineeName}</span>
              </div>
              {currentUser && (
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  • {currentUser.role} @ {currentUser.agency}
                </span>
              )}
              {onOpenProfileModal && (
                <button
                  onClick={onOpenProfileModal}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Database className="w-3 h-3 text-emerald-600" />
                  Manage Account
                </button>
              )}
              {/* Daily Streak Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{progress.streakDays || 1} Day Streak</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated across 7 Cs of Communication, 6 Golden Rules, Voice & Accent, and Insurance Workflows.
            </p>
          </div>

          {/* Readiness Badge */}
          <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${readiness.color}`}>
            <Award className="w-6 h-6 shrink-0" />
            <div>
              <div className="text-xs uppercase tracking-wider font-bold">Readiness Level</div>
              <div className="text-sm font-extrabold">{readiness.label} ({readiness.grade})</div>
            </div>
          </div>
        </div>

        {/* 4-Column Bento Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Messages Checked */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Messages Checked</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              {totalChecks}
            </div>
            <div className="text-[11px] text-slate-500">
              Avg Score: <strong className="text-emerald-700">{avgMessageScore > 0 ? `${avgMessageScore}%` : '—'}</strong>
            </div>
          </div>

          {/* Mock Calls */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Mock Calls Completed</span>
              <PhoneCall className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              {totalMockCalls}
            </div>
            <div className="text-[11px] text-slate-500">
              Avg Mastery: <strong className="text-emerald-700">{avgMockCallScore > 0 ? `${avgMockCallScore}%` : '—'}</strong>
            </div>
          </div>

          {/* Vocabulary Flashcards */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Vocab Items Studied</span>
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              {flashcardsMastered}
            </div>
            <div className="text-[11px] text-slate-500">
              Memory Match Score: <strong className="text-emerald-700">{memoryHighScore > 0 ? `${memoryHighScore}%` : '—'}</strong>
            </div>
          </div>

          {/* Accent Pronunciation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Accent Lab Checks</span>
              <Headphones className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              {progress.pronunciationChecksCount || 0}
            </div>
            <div className="text-[11px] text-slate-500">
              Avg Accuracy: <strong className="text-emerald-700">{progress.pronunciationAvgAccuracy ? `${progress.pronunciationAvgAccuracy}%` : '—'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* AOS & AOI SECTION (EXPLICIT USER REQUIREMENT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AOS: Areas of Strength */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <h3>Areas of Strength (AOS)</h3>
                <p className="text-[11px] text-slate-500 font-normal">Demonstrated workplace competencies</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {calculatedAos.length} Strengths
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {calculatedAos.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-800 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AOI: Areas for Improvement */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3>Areas for Improvement (AOI)</h3>
                <p className="text-[11px] text-slate-500 font-normal">Target developmental focus areas</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {calculatedAoi.length} Focus Points
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {calculatedAoi.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span className="text-xs text-slate-800 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHERE USER HAS WORKED VS WHERE USER NEEDS TO WORK UPON */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Operational Competency Progression Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Module-by-module breakdown comparing completed practice against recommended mastery targets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              module: 'Policy Quote Creation (Day 6)',
              status: 'Proficient',
              whereWorked: 'Gathering commercial risk params, building limits, and loss runs.',
              whereNeedsWork: 'Specifying exact deadline cutoffs and underwriter follow-up timestamps.',
              score: 86,
              actionView: 'mock-calls' as NavView,
            },
            {
              module: 'NOC & Endorsements (Day 6)',
              status: 'Developing',
              whereWorked: 'Bank loan vehicle transfer release wording and lienholder updates.',
              whereNeedsWork: 'Attaching the operational reason ("so that bank releases vehicle today").',
              score: 74,
              actionView: 'mock-calls' as NavView,
            },
            {
              module: 'Document Request & ACORD (Day 7)',
              status: 'Mastered',
              whereWorked: 'Drafting polite requests for missing Statement of Values and loss runs.',
              whereNeedsWork: 'Maintaining dual-phase (Action Taken & Action Ahead) updates.',
              score: 91,
              actionView: 'check' as NavView,
            },
            {
              module: 'Claims & Escalations (Day 8)',
              status: 'Developing',
              whereWorked: 'De-escalating angry insureds whose payouts or endorsements lagged.',
              whereNeedsWork: 'Zero-blame consistency when callers push back aggressively.',
              score: 78,
              actionView: 'mock-calls' as NavView,
            },
            {
              module: 'Accent Pronunciation (US / UK / CA)',
              status: 'Proficient',
              whereWorked: 'US Rhotic R bunching, Canadian Raising on "about" and "out".',
              whereNeedsWork: 'British true aspirated T and non-rhotic schwa word endings.',
              score: 85,
              actionView: 'pronunciation' as NavView,
            },
            {
              module: 'Categorized Vocab & Flashcards',
              status: 'Mastered',
              whereWorked: 'Corporate abbreviations (SLA, TAT, EOD, COB) and policy terminology.',
              whereNeedsWork: 'Advanced reinsurance clauses and subrogation terminology.',
              score: 94,
              actionView: 'flashcards' as NavView,
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.module}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'Mastered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'Proficient'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status} ({item.score}%)
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-600">
                  <strong className="text-emerald-800">Where you worked:</strong> {item.whereWorked}
                </div>
                <div className="text-slate-600">
                  <strong className="text-amber-800">Where to work next:</strong> {item.whereNeedsWork}
                </div>
              </div>

              <div className="pt-1 flex justify-end print:hidden">
                <button
                  onClick={() => onNavigate(item.actionView)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <span>Practice this module</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT CHECKED MESSAGES */}
      {progress.history && progress.history.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Message Analyses
                </h3>
                <p className="text-[11px] text-slate-500">Click any message to review coaching breakdown or re-test</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {progress.history.length} Analyzed Messages
            </span>
          </div>

          <div className="space-y-3">
            {progress.history.slice(0, 5).map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedCheckedMsg(msg)}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 capitalize">
                      {msg.audience.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border text-[10px] text-slate-600 capitalize">
                      {msg.channel}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 font-mono text-[11px] truncate">
                    "{msg.originalSnippet}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Strongest: <strong className="text-emerald-700 capitalize">{msg.strongestC}</strong></span>
                    <span>•</span>
                    <span>Growth: <strong className="text-amber-700 capitalize">{msg.growthC}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-extrabold text-base text-emerald-700 font-mono">
                      {msg.overallScore}%
                    </div>
                    <div className="text-[10px] text-slate-400">7 Cs Score</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('check', { prefillMessage: msg.originalSnippet, audience: msg.audience });
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-emerald-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Re-check this message in Message Checker"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT MOCK CALLS LOG */}
      {mockCalls.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent AI Mock Call Sessions
                </h3>
                <p className="text-[11px] text-slate-500">Click any session to view scorecard, tips, and transcript</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {mockCalls.length} Recorded Calls
            </span>
          </div>

          <div className="space-y-3">
            {mockCalls.slice(0, 5).map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedMockCall(call)}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 capitalize">
                      {call.character} ({call.gender}, {call.accent.toUpperCase()})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border text-[10px] text-slate-600">
                      Tone: {call.tone}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Topic: {call.topicLabel} • Duration: {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-extrabold text-base text-emerald-700 font-mono">
                      {call.overallScore}%
                    </div>
                    <div className="text-[10px] text-slate-400">7 Cs Score</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Mock Call Detail Inspection */}
      {selectedMockCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Mock Call Performance Audit
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 capitalize">
                  {selectedMockCall.character} ({selectedMockCall.topicLabel})
                </h3>
                <p className="text-xs text-slate-500">
                  Tone: {selectedMockCall.tone} • Accent: {selectedMockCall.accent.toUpperCase()} • Duration: {Math.floor(selectedMockCall.durationSeconds / 60)}m {selectedMockCall.durationSeconds % 60}s
                </p>
              </div>
              <button
                onClick={() => setSelectedMockCall(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Hero */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-800 font-semibold">Overall Communication Score</div>
                <div className="text-2xl font-black text-emerald-900 font-mono">{selectedMockCall.overallScore}%</div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-200">
                  {selectedMockCall.evaluation?.grade || 'Proficient'}
                </span>
              </div>
            </div>

            {/* Call Management Tips (Agent 3 & Agent 5 finding fix) */}
            {selectedMockCall.evaluation?.callManagementTips && selectedMockCall.evaluation.callManagementTips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Call Management Coaching Tips</h4>
                <div className="space-y-1.5">
                  {selectedMockCall.evaluation.callManagementTips.map((tip: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Golden Rules Checklist */}
            {selectedMockCall.evaluation?.goldenRulesEvaluation && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">6 Golden Rules Verification</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedMockCall.evaluation.goldenRulesEvaluation).map(([ruleKey, passed]: [string, any]) => (
                    <div key={ruleKey} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="capitalize text-slate-700 font-medium">
                        {ruleKey.replace(/([A-Z])/g, ' $1')}
                      </span>
                      {passed ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Needs Polish</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Transcript */}
            {selectedMockCall.transcript && selectedMockCall.transcript.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dialogue Transcript</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 max-h-60 overflow-y-auto text-xs">
                  {selectedMockCall.transcript.map((turn: any, idx: number) => (
                    <div key={idx} className={`p-2.5 rounded-xl ${turn.speaker === 'user' ? 'bg-emerald-100/70 text-emerald-950 ml-6' : 'bg-white border text-slate-800 mr-6'}`}>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                        {turn.speaker === 'user' ? 'Trainee' : selectedMockCall.character}
                      </span>
                      {turn.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMockCall(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Checked Message Detail Inspection */}
      {selectedCheckedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Message Analysis Record
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 capitalize">
                  {selectedCheckedMsg.audience.replace(/_/g, ' ')} • {selectedCheckedMsg.channel}
                </h3>
                <p className="text-xs text-slate-500">
                  Analyzed at {selectedCheckedMsg.timestamp}
                </p>
              </div>
              <button
                onClick={() => setSelectedCheckedMsg(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Hero */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-800 font-semibold">Overall Communication Score</div>
                <div className="text-2xl font-black text-emerald-900 font-mono">{selectedCheckedMsg.overallScore}%</div>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200">
                  Strongest: {selectedCheckedMsg.strongestC}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Growth: {selectedCheckedMsg.growthC}
                </span>
              </div>
            </div>

            {/* Original Message */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Message</h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedCheckedMsg.originalSnippet}
              </div>
            </div>

            {/* Improved Exemplar (if available) */}
            {selectedCheckedMsg.fullData?.improvedMessage && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">ClearCue Exemplar Rewrite</h4>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 font-sans whitespace-pre-wrap leading-relaxed">
                  {selectedCheckedMsg.fullData.improvedMessage}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  const snippet = selectedCheckedMsg.originalSnippet;
                  const aud = selectedCheckedMsg.audience;
                  setSelectedCheckedMsg(null);
                  onNavigate('check', { prefillMessage: snippet, audience: aud });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Re-check in Message Checker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedCheckedMsg(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSTRUCTOR SIGN-OFF (PRINTABLE ONLY) */}
      <div className="hidden print:block pt-12 border-t-2 border-slate-300">
        <div className="grid grid-cols-2 gap-8 text-xs text-slate-800">
          <div>
            <p className="font-bold">L&D Communication Specialist:</p>
            <p className="mt-8 font-serif font-bold text-slate-900 text-sm">Prateek Bhatt</p>
            <p className="text-slate-500">Founder & L&D Lead, ClearCue</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Candidate Signature & Date:</p>
            <p className="mt-8 border-b border-slate-400 inline-block w-48 text-right font-mono text-slate-600">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Mr. Cuckoo Advice */}
      <div className="print:hidden">
        <MrCuckoo
          variant="card"
          title="Mr. Cuckoo's Growth Philosophy"
          message="Consistent excellence in high-stakes operational communication comes from continuous reflection. Notice your AOI (Areas for Improvement)—especially adding operational impact ('so that...') and giving exact follow-up timestamps. These subtle shifts build undeniable client trust."
        />
      </div>
    </div>
  );
};
