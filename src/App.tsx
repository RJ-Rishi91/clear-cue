import React, { useState, useEffect } from 'react';
import { NavView, SevenCKey, UserProgressData, CheckedMessageRecord, Audience, MockCallRecord, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SevenCsView } from './components/SevenCsView';
import { CheckMessageView } from './components/CheckMessageView';
import { DraftEmailView } from './components/DraftEmailView';
import { PronunciationView } from './components/PronunciationView';
import { FlashcardsView } from './components/FlashcardsView';
import { PracticeView } from './components/PracticeView';
import { ProgressView } from './components/ProgressView';
import { AboutView } from './components/AboutView';
import { MockCallView } from './components/MockCallView';
import { FloatingCuckooCoach } from './components/FloatingCuckooCoach';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { MasterPanel } from './components/MasterPanel';
import { AdminPanel } from './components/AdminPanel';
import { TeacherStudio } from './components/TeacherStudio';
import { 
  fetchUsers, 
  fetchUserProgress, 
  saveCheckedMessage, 
  saveMockCallRecord, 
  saveUserProgress, 
  resetDatabaseProgress,
  getCurrentUser,
  logoutUser
} from './utils/api';

const STORAGE_KEY_PROGRESS = 'clearcue_user_progress_v2';

const INITIAL_PROGRESS: UserProgressData = {
  totalChecked: 3,
  averageScore: 84,
  flashcardsMastered: 38,
  memoryMatchHighScore: 94,
  pronunciationChecksCount: 5,
  pronunciationAvgAccuracy: 89,
  history: [
    {
      id: 'demo-1',
      timestamp: 'Today, 8:45 AM',
      audience: 'client',
      channel: 'email',
      originalSnippet: "I'll check and let you know.",
      overallScore: 78,
      strongestC: 'courteous',
      growthC: 'concrete',
    },
    {
      id: 'demo-2',
      timestamp: 'Yesterday, 3:15 PM',
      audience: 'carrier',
      channel: 'email',
      originalSnippet: 'Could you please confirm the loss runs so that I can bind coverage today?',
      overallScore: 92,
      strongestC: 'concise',
      growthC: 'complete',
    },
  ],
  mockCallHistory: [
    {
      id: 'mock-sample-1',
      timestamp: new Date().toISOString(),
      character: 'insured',
      gender: 'female',
      accent: 'us',
      tone: 'rude',
      callType: 'asking_update',
      topic: 'docs_request',
      topicLabel: 'Documents Request (Missing Forms & Loss Runs)',
      durationSeconds: 145,
      overallScore: 88,
      transcript: [],
      evaluation: {
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
      },
    },
  ],
  completedScenarioIds: ['carrier-loss-runs'],
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'usr_guest_demo',
  username: 'sarah_jenkins',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@coverdirect.com',
  role: 'Insurance Operations Specialist (Commercial Lines VA)',
  agency: 'CoverDirect Agency US',
  avatar: 'avatar-1',
};

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [selectedPrincipleKey, setSelectedPrincipleKey] = useState<SevenCKey | undefined>(undefined);
  const [checkerPrefill, setCheckerPrefill] = useState<string>('');
  const [checkerAudience, setCheckerAudience] = useState<Audience>('agency_owner');

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [progress, setProgress] = useState<UserProgressData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  });

  // Hydrate authenticated user session on mount
  useEffect(() => {
    async function loadInitialSession() {
      try {
        const authenticatedUser = await getCurrentUser();
        if (authenticatedUser) {
          setCurrentUser(authenticatedUser);
          const remoteProgress = await fetchUserProgress(authenticatedUser.id);
          if (remoteProgress) {
            setProgress(remoteProgress);
          }
          return;
        }
        // If not authenticated, stay logged out
        setCurrentUser(null);
      } catch (err) {
        console.warn('Initial session loading warning:', err);
        setCurrentUser(null);
      }
    }
    loadInitialSession();
  }, []);

  // Persist progress changes to localStorage as offline mirror
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const handleUserChanged = async (user: UserProfile) => {
    setCurrentUser(user);
    try {
      const remote = await fetchUserProgress(user.id);
      if (remote) {
        setProgress(remote);
      }
    } catch (err) {
      console.warn('Error loading switched user progress:', err);
    }
  };

  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    try {
      const remote = await fetchUserProgress(user.id);
      if (remote) {
        setProgress(remote);
      }
    } catch (err) {
      console.warn('Error fetching authenticated user progress:', err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (view: NavView, payload?: any) => {
    if (payload?.activeC) {
      setSelectedPrincipleKey(payload.activeC);
    }
    if (payload?.prefillMessage) {
      setCheckerPrefill(payload.prefillMessage);
    }
    if (payload?.audience) {
      setCheckerAudience(payload.audience);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordAnalyzed = (record: CheckedMessageRecord) => {
    setProgress((prev) => {
      const updatedHistory = [record, ...prev.history].slice(0, 30);
      const total = prev.totalChecked + 1;
      const sum = updatedHistory.reduce((acc, curr) => acc + curr.overallScore, 0);
      const avg = Math.round(sum / updatedHistory.length);

      const next = {
        ...prev,
        totalChecked: total,
        averageScore: avg,
        history: updatedHistory,
      };

      if (currentUser?.id) {
        saveCheckedMessage(currentUser.id, record).catch((e) =>
          console.warn('Failed saving message record:', e)
        );
      }

      return next;
    });
  };

  const handleMockCallSaved = (record: MockCallRecord) => {
    setProgress((prev) => {
      const existing = prev.mockCallHistory || [];
      const updatedCalls = [record, ...existing].slice(0, 20);
      const next = {
        ...prev,
        mockCallHistory: updatedCalls,
      };

      if (currentUser?.id) {
        saveMockCallRecord(currentUser.id, record).catch((e) =>
          console.warn('Failed saving mock call record:', e)
        );
      }

      return next;
    });
  };

  const handleScenarioCompleted = (scenarioId: string, score: number) => {
    setProgress((prev) => {
      if (prev.completedScenarioIds.includes(scenarioId)) {
        return prev;
      }
      const updatedIds = [...prev.completedScenarioIds, scenarioId];
      if (currentUser?.id) {
        saveUserProgress(currentUser.id, { completedScenarioIds: updatedIds }).catch(console.warn);
      }
      return {
        ...prev,
        completedScenarioIds: updatedIds,
      };
    });
  };

  const handlePronunciationCompleted = (accuracyScore: number) => {
    setProgress((prev) => {
      const currentCount = prev.pronunciationChecksCount || 0;
      const currentAvg = prev.pronunciationAvgAccuracy || 0;
      const newCount = currentCount + 1;
      const newAvg = Math.round(((currentAvg * currentCount) + accuracyScore) / newCount);
      const next = {
        ...prev,
        pronunciationChecksCount: newCount,
        pronunciationAvgAccuracy: newAvg,
      };

      if (currentUser?.id) {
        saveUserProgress(currentUser.id, {
          pronunciationChecksCount: newCount,
          pronunciationAvgAccuracy: newAvg,
        }).catch(console.warn);
      }

      return next;
    });
  };

  const handleResetProgress = async () => {
    const userName = currentUser?.name || 'Current User';
    if (window.confirm(`Are you sure you want to reset training metrics for ${userName}?`)) {
      const resetData: UserProgressData = {
        totalChecked: 0,
        averageScore: 0,
        flashcardsMastered: 0,
        memoryMatchHighScore: 0,
        pronunciationChecksCount: 0,
        pronunciationAvgAccuracy: 0,
        history: [],
        mockCallHistory: [],
        completedScenarioIds: [],
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      setProgress(resetData);
      if (currentUser?.id) {
        try {
          await resetDatabaseProgress(currentUser.id);
        } catch (e) {
          console.warn('Failed to reset db progress:', e);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      {/* Top Navigation Bar with Authentication and View Switcher */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        checkedCount={progress.totalChecked}
        currentUser={currentUser}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}

        {currentView === 'seven-cs' && (
          <SevenCsView
            onNavigate={handleNavigate}
            initialSelectedC={selectedPrincipleKey}
          />
        )}

        {currentView === 'check' && (
          <CheckMessageView
            initialMessage={checkerPrefill}
            initialAudience={checkerAudience}
            onRecordAnalyzed={handleRecordAnalyzed}
            onNavigateToMailWriter={() => handleNavigate('draft-email')}
            onNavigateToPronunciation={() => handleNavigate('pronunciation')}
          />
        )}

        {currentView === 'draft-email' && (
          <DraftEmailView
            onSendToChecker={(draftText, aud) => {
              handleNavigate('check', { prefillMessage: draftText, audience: aud });
            }}
          />
        )}

        {currentView === 'mock-calls' && (
          <MockCallView
            onSaveMockCallResult={handleMockCallSaved}
            onNavigateToDashboard={() => handleNavigate('progress')}
          />
        )}

        {currentView === 'pronunciation' && (
          <PronunciationView
            currentUser={currentUser || undefined}
            onPronunciationCompleted={handlePronunciationCompleted}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardsView
            onNavigateToPractice={() => handleNavigate('practice')}
          />
        )}

        {currentView === 'practice' && (
          <PracticeView
            completedScenarioIds={progress.completedScenarioIds}
            onScenarioCompleted={handleScenarioCompleted}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            progress={progress}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
            currentUser={currentUser || undefined}
            onOpenProfileModal={() => setProfileModalOpen(true)}
          />
        )}

        {currentView === 'about' && <AboutView onNavigate={handleNavigate} />}

        {currentView === 'master-panel' && currentUser && (
          <MasterPanel currentUser={currentUser} />
        )}

        {currentView === 'admin-panel' && currentUser && (
          <AdminPanel currentUser={currentUser} />
        )}

        {currentView === 'teacher-panel' && currentUser && (
          <TeacherStudio currentUser={currentUser} />
        )}
      </main>

      {/* Floating Mr. Cuckoo Voice Coach */}
      <FloatingCuckooCoach />

      {/* User Profile & Account Settings Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          currentUser={currentUser}
          onUserChanged={handleUserChanged}
          onOpenSignup={() => handleOpenAuthModal('signup')}
        />
      )}

      {/* Authentication Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
