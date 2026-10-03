import React, { useState, useEffect, useRef } from 'react';
import { 
  MockCallCharacter, 
  MockCallGender, 
  MockCallTone, 
  MockCallType, 
  MockCallTopic,
  MockCallTurn,
  MockCallEvaluation,
  MockCallRecord,
  AccentType,
  ScenarioDefinition,
  MockCallCategory
} from '../types';
import { MOCK_CALL_SCENARIOS } from '../data/mockCallScenarios';
import { MrCuckoo } from './MrCuckoo';
import { getMockCallToneConfig } from '../utils/voiceUtils';
import { 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Award, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  User, 
  Building2, 
  FileText, 
  Smile, 
  Frown, 
  Meh, 
  Check, 
  ChevronRight,
  ThumbsUp,
  Download,
  BookOpen,
  Info,
  ListOrdered,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink,
  Printer
} from 'lucide-react';

interface MockCallViewProps {
  onSaveMockCallResult?: (record: MockCallRecord) => void;
  onNavigateToDashboard?: () => void;
}

interface TopicConfig {
  id: MockCallTopic;
  title: string;
  badge: string;
  description: string;
  sampleAiOpening: {
    polite: string;
    normal: string;
    rude: string;
  };
}

const TOPICS_CONFIG: TopicConfig[] = [
  {
    id: 'policy_quote',
    title: 'Policy Quote Creation Request',
    badge: 'Day 6 • Quoting',
    description: 'Gathering commercial risk parameters, limits, deductibles, and submission deadlines.',
    sampleAiOpening: {
      polite: "Good morning! This is Alex from Apex Logistics. Could you please help me get a new policy quote for our expanded warehouse property in Ohio?",
      normal: "Hi there, calling to request a commercial property policy quote for our warehouse location. Let me know what information you need from my end.",
      rude: "Listen, I asked for a policy quote yesterday and haven't heard a peep! Are you guys working on my warehouse quote or am I wasting my time here?",
    },
  },
  {
    id: 'noc_creation',
    title: 'NOC (No Objection Certificate) Creation',
    badge: 'Day 6 • Endorsement',
    description: 'Processing mortgagee or lienholder NOC requests for bank loan clearance and vehicle release.',
    sampleAiOpening: {
      polite: "Hello! I am calling regarding Policy #GL-4091. Our bank requires an urgent No Objection Certificate (NOC) for our financing clearance. Could you guide me on the issuance timeline?",
      normal: "Hi, I need an NOC document generated for the vehicle fleet under Policy #AC-8812. The financing partner needs it to approve the vehicle transfer.",
      rude: "I’ve been on hold for twenty minutes! The bank is holding up our loan because they don't have the NOC from your agency. I need that certificate right now!",
    },
  },
  {
    id: 'docs_request',
    title: 'Documents Request (Missing Forms & Loss Runs)',
    badge: 'Day 7 • Documents',
    description: 'Securing signed ACORD statements, statement of values, and 5-year currently valued loss runs.',
    sampleAiOpening: {
      polite: "Hello, this is Morgan from Underwriting. I am reviewing the submission for Riverfront Transport, but I noticed the signed Statement of Values and 5-year loss runs are missing.",
      normal: "Hi, calling from Travelers underwriting. We received the application for Riverfront, but we cannot bind until we receive the signed ACORD 125 and loss runs.",
      rude: "Why am I getting emails saying my file is incomplete? I sent all my paperwork two weeks ago! Tell me exactly what documents you claim are missing.",
    },
  },
  {
    id: 'claim_verification',
    title: 'Claim Verification & Discrepancy Resolution',
    badge: 'Day 8 • Claims',
    description: 'Cross-checking date of loss, verifying facts, and resolving discrepancies between statement and police report.',
    sampleAiOpening: {
      polite: "Hi, I am calling to verify the incident details for Claim #CL-9082. There appears to be a slight date discrepancy between the incident notice and the police report.",
      normal: "Hello, claims intake here. We are processing Claim #CL-9082 for vehicle damage, but the date of loss on your form does not match the towing receipt.",
      rude: "Why hasn't my claim check been sent out yet? Your adjuster promised it would be processed Monday, and now someone is asking me to re-verify everything again!",
    },
  },
  {
    id: 'policy_issuance',
    title: 'Policy Issuance & Status Tracking',
    badge: 'Day 7 • Issuance',
    description: 'Tracking policy status before/during/after issuance and communicating with carrier teams.',
    sampleAiOpening: {
      polite: "Good afternoon! Could you please give me a quick status update on Policy #CP-5521? Our client is inquiring whether the formal policy contract has been issued by the carrier.",
      normal: "Hi, following up on the issuance of Policy #CP-5521 bound last Thursday. Has the carrier generated the final dec page and policy package yet?",
      rude: "We bound coverage two weeks ago and our customer still hasn't received their official policy jacket! The agency owner is furious. Where is the document?",
    },
  },
  {
    id: 'escalated_delay',
    title: 'Escalated Delay & Customer De-escalation',
    badge: 'Day 8 • Escalation',
    description: 'De-escalating an angry insured whose endorsement or certificate was delayed without shifting blame.',
    sampleAiOpening: {
      polite: "Hello, I am checking in because we requested an endorsement change three days ago and haven't received confirmation. Could you please check if it is done?",
      normal: "Hi, my general contractor is threatening to throw our crew off the job site because our Certificate of Insurance hasn't arrived. I need this escalated.",
      rude: "This is completely unacceptable! Your team dropped the ball and cost us a fifty-thousand-dollar contract! Who is responsible for this mess?",
    },
  },
];

const CURRICULUM_CATEGORIES = [
  { id: 'all', label: 'All 13 Scenarios' },
  { id: 'task_assignment', label: '1. Task-Assigning' },
  { id: 'weekly_update', label: '2. Weekly Updates' },
  { id: 'feedback_handling', label: '3. Feedback Calls' },
  { id: 'carrier_inquiry', label: '4. Carrier Calls' },
  { id: 'insured_direct', label: '5. Insured Direct' },
  { id: 'cross_character', label: '6. Multi-Task Cycles' },
];

export const MockCallView: React.FC<MockCallViewProps> = ({
  onSaveMockCallResult,
  onNavigateToDashboard,
}) => {
  // Mode selection: 'curriculum' (13 scenarios) or 'custom'
  const [selectionMode, setSelectionMode] = useState<'curriculum' | 'custom'>('curriculum');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario_1a_client_tasks');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Custom Configuration State
  const [character, setCharacter] = useState<MockCallCharacter>('client');
  const [gender, setGender] = useState<MockCallGender>('female');
  const [accent, setAccent] = useState<AccentType>('us');
  const [tone, setTone] = useState<MockCallTone>('normal');
  const [callType, setCallType] = useState<MockCallType>('task_assignment');
  const [selectedTopic, setSelectedTopic] = useState<MockCallTopic>('policy_quote');

  // Call Lifecycle State
  const [callStatus, setCallStatus] = useState<'setup' | 'ringing' | 'connected' | 'ended'>('setup');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [transcript, setTranscript] = useState<MockCallTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [evaluation, setEvaluation] = useState<MockCallEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [showDeskNotes, setShowDeskNotes] = useState(true);
  const [coachingAlert, setCoachingAlert] = useState<string | null>(null);
  const [isCallEndingNotice, setIsCallEndingNotice] = useState(false);

  const callTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Active scenario definition
  const currentScenario = MOCK_CALL_SCENARIOS.find((s) => s.id === selectedScenarioId) || MOCK_CALL_SCENARIOS[0];
  const currentTopicConfig = TOPICS_CONFIG.find((t) => t.id === selectedTopic) || TOPICS_CONFIG[0];

  // Synchronize scenario configuration when selection changes in curriculum mode
  useEffect(() => {
    if (selectionMode === 'curriculum' && currentScenario) {
      setCharacter(currentScenario.character);
      setTone(currentScenario.tone);
      setCallType(currentScenario.callType as MockCallType);
    }
  }, [selectedScenarioId, selectionMode]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isGeneratingReply]);

  // Call timer interval
  useEffect(() => {
    if (callStatus === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callStatus]);

  // Setup Web Speech Recognition for trainee voice
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = accent === 'uk' ? 'en-GB' : accent === 'ca' ? 'en-CA' : 'en-US';

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setUserInput(text);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
    }
  }, [accent]);

  // Speech synthesis for AI Caller voice
  const speakAiText = (text: string) => {
    if (!speakerEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick voice matching gender & accent
    const voices = window.speechSynthesis.getVoices();
    const isMale = gender === 'male';
    const toneConfig = getMockCallToneConfig(tone, isMale);

    let matchedVoice: SpeechSynthesisVoice | null = null;

    if (accent === 'uk') {
      matchedVoice = voices.find(v => (v.lang.includes('en-GB') || v.name.toLowerCase().includes('british')) && (isMale ? v.name.toLowerCase().includes('male') || v.name.includes('George') : true)) || null;
    } else if (accent === 'ca') {
      matchedVoice = voices.find(v => v.lang.includes('en-CA')) || null;
    } else {
      // US / General
      matchedVoice = voices.find(v => v.lang.includes('en-US') && (isMale ? v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male') || v.name.includes('Guy') : v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.includes('Jenny') || v.name.includes('Aria'))) || null;
    }

    // Apply voice and dynamic emotional tone inflection
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.pitch = toneConfig.pitch;
    utterance.rate = toneConfig.rate;
    utterance.volume = toneConfig.volume;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start Call
  const handleStartCall = () => {
    setCallStatus('ringing');
    setCallSeconds(0);
    setTranscript([]);
    setEvaluation(null);
    setCoachingAlert(null);
    setIsCallEndingNotice(false);

    // Connect after 1.6s ringing delay
    setTimeout(() => {
      setCallStatus('connected');
      
      let openingLine = '';
      if (selectionMode === 'curriculum') {
        openingLine = currentScenario.initialOpeningLine || currentScenario.referenceDialogue?.[0]?.text || "Hi, I have a few things I'd like you to work on today.";
      } else {
        openingLine = currentTopicConfig.sampleAiOpening[tone];
      }

      const initialTurn: MockCallTurn = {
        id: `turn-0`,
        speaker: 'ai',
        text: openingLine,
        timestamp: '00:01',
      };
      setTranscript([initialTurn]);
      speakAiText(openingLine);
    }, 1600);
  };

  // Trainee sends response (voice or typed)
  const handleSendResponse = async () => {
    if (!userInput.trim() || isGeneratingReply) return;

    const userText = userInput.trim();
    setUserInput('');

    const formattedTime = formatTime(callSeconds);
    const newTurn: MockCallTurn = {
      id: `turn-${transcript.length}`,
      speaker: 'user',
      text: userText,
      timestamp: formattedTime,
    };

    const updatedTranscript = [...transcript, newTurn];
    setTranscript(updatedTranscript);

    // Live Golden Rules & De-escalation recognition
    const lower = userText.toLowerCase();
    if (lower.includes('so that') || lower.includes('in order to')) {
      setCoachingAlert('✨ Golden Rule #2: Excellent operational reason ("so that...") attached!');
      setTimeout(() => setCoachingAlert(null), 3500);
    } else if (tone === 'rude' && !/fault|blame|excuse|not my/i.test(lower) && /understand|apologize|resolve|prioritize/i.test(lower)) {
      setCoachingAlert('🛡️ Great De-escalation: Composure held without deflecting blame.');
      setTimeout(() => setCoachingAlert(null), 3500);
    }

    // Call dynamic backend engine
    await generateAiReply(userText, updatedTranscript);
  };

  // Generate dynamic AI dialogue turn via /api/mock-call-turn
  const generateAiReply = async (userText: string, currentHistory: MockCallTurn[]) => {
    setIsGeneratingReply(true);

    try {
      const response = await fetch('/api/mock-call-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectionMode === 'curriculum' ? currentScenario.id : selectedTopic,
          scenarioData: selectionMode === 'curriculum' ? currentScenario.scenarioData : { topic: currentTopicConfig.title, description: currentTopicConfig.description },
          character,
          characterTitle: selectionMode === 'curriculum' ? currentScenario.characterTitle : character,
          tone,
          callType,
          aiObjective: selectionMode === 'curriculum' ? currentScenario.aiObjective : currentTopicConfig.description,
          expectedBehaviours: selectionMode === 'curriculum' ? currentScenario.expectedBehaviours : ['Clarity', 'Active listening', 'Confirming next steps'],
          transcript: currentHistory,
          latestUserMessage: userText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.aiReply || "Understood. Please proceed with that and keep me posted.";

      if (data.coachingInsight) {
        setCoachingAlert(data.coachingInsight);
        setTimeout(() => setCoachingAlert(null), 4000);
      }

      if (data.isCallEnding) {
        setIsCallEndingNotice(true);
      }

      const aiTurn: MockCallTurn = {
        id: `turn-${currentHistory.length + 1}`,
        speaker: 'ai',
        text: aiReply,
        timestamp: formatTime(callSeconds + 1),
      };

      setTranscript((prev) => [...prev, aiTurn]);
      speakAiText(aiReply);
    } catch (err) {
      console.warn('Fallback local dialogue turn on network exception:', err);
      // Gentle offline fallback
      const fallbackReply = tone === 'rude' 
        ? "Fine, please make sure you don't drop the ball. Keep me updated once the first task is done." 
        : "Understood. That works for our schedule. Please keep me posted on the progress.";
      
      const aiTurn: MockCallTurn = {
        id: `turn-${currentHistory.length + 1}`,
        speaker: 'ai',
        text: fallbackReply,
        timestamp: formatTime(callSeconds + 1),
      };
      setTranscript((prev) => [...prev, aiTurn]);
      speakAiText(fallbackReply);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Toggle Mic
  const handleToggleMic = () => {
    if (isListeningMic) {
      recognitionRef.current?.stop();
      setIsListeningMic(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListeningMic(true);
        } catch {
          // ignore
        }
      } else {
        alert('Microphone speech recognition is not supported in this browser. Please type your response.');
      }
    }
  };

  // End Call & Trigger Full Evaluation
  const handleEndCall = async () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallStatus('ended');
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/mock-call-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectionMode === 'curriculum' ? currentScenario.id : selectedTopic,
          scenarioTitle: selectionMode === 'curriculum' ? currentScenario.title : currentTopicConfig.title,
          character,
          tone,
          scenarioData: selectionMode === 'curriculum' ? currentScenario.scenarioData : { topic: currentTopicConfig.title },
          aiObjective: selectionMode === 'curriculum' ? currentScenario.aiObjective : currentTopicConfig.description,
          expectedBehaviours: selectionMode === 'curriculum' ? currentScenario.expectedBehaviours : [],
          transcript,
          durationSeconds: callSeconds,
        }),
      });

      if (!response.ok) throw new Error('Evaluation request failed');
      const evalData = await response.json();

      const finalEval: MockCallEvaluation = {
        overallScore: evalData.overallScore || 80,
        grade: evalData.grade || 'B',
        callDurationFormatted: formatTime(callSeconds),
        sevenCsBreakdown: evalData.sevenCsBreakdown || {
          clarity: 82,
          conciseness: 80,
          concreteness: 78,
          correctness: 85,
          coherence: 82,
          completeness: 80,
          courtesy: 85,
        },
        goldenRulesEvaluation: evalData.goldenRulesEvaluation || {
          outcomeFirst: true,
          reasonAttached: true,
          actionTakenAhead: true,
          politeNotCommand: true,
          zeroBlame: true,
          noVagueWords: true,
        },
        areasOfStrength: evalData.areasOfStrength || ['Demonstrated clear tone', 'Answered prompt without delay'],
        areasForImprovement: evalData.areasForImprovement || ['Attach operational reasons ("so that...") to all inquiries'],
        callManagementTips: evalData.callManagementTips || ['Confirm priority sequencing before disconnecting.'],
        turnByTurnFeedback: evalData.turnByTurnFeedback || [],
      };

      setEvaluation(finalEval);

      // Save to progress record
      if (onSaveMockCallResult) {
        const record: MockCallRecord = {
          id: `call-${Date.now()}`,
          timestamp: new Date().toISOString(),
          character,
          gender,
          accent,
          tone,
          callType,
          topic: selectionMode === 'curriculum' ? (currentScenario.id as any) : selectedTopic,
          topicLabel: selectionMode === 'curriculum' ? `${currentScenario.scenarioCode}: ${currentScenario.title}` : currentTopicConfig.title,
          durationSeconds: callSeconds,
          overallScore: finalEval.overallScore,
          transcript,
          evaluation: finalEval,
        };
        onSaveMockCallResult(record);
      }
    } catch (err) {
      console.warn('Server evaluation failed, using client-side rubric fallback:', err);
      fallbackClientEvaluation();
    } finally {
      setIsEvaluating(false);
    }
  };

  // Client-side fallback evaluator if backend is unreachable
  const fallbackClientEvaluation = () => {
    const userTurns = transcript.filter((t) => t.speaker === 'user');
    const fullUserText = userTurns.map((t) => t.text).join(' ');
    const lower = fullUserText.toLowerCase();

    const hasOutcomeFirst = /^(could you please|may i please|i have|the renewal is|status update|yes,)/i.test(userTurns[0]?.text.trim() || '') || (userTurns[0]?.text.length || 0) < 90;
    const hasReasonAttached = /\b(so that|in order to|because|to ensure|which allows us to)\b/i.test(lower);
    const hasActionTakenAhead = /\b(i have|action taken|reviewed|checked)\b/i.test(lower) && /\b(will follow up|action ahead|by \d|by today|by tomorrow|will email)\b/i.test(lower);
    const hasPoliteNotCommand = /\b(could you please|may i please|would you please|thank you)\b/i.test(lower);
    const hasZeroBlame = !/\b(your fault|you forgot|not my problem|carrier is slow|colleague made a mistake|our system crashed)\b/i.test(lower);
    const hasNoVagueWords = !/\b(asap|some time|a few days|many issues|quickly)\b/i.test(lower);

    let clarity = 80;
    let conciseness = 82;
    let concreteness = 78;
    let correctness = 85;
    let coherence = 82;
    let completeness = 75;
    let courtesy = 80;

    if (hasOutcomeFirst) clarity += 8; else clarity -= 10;
    if (hasReasonAttached) { coherence += 8; completeness += 8; } else { coherence -= 8; completeness -= 10; }
    if (hasActionTakenAhead) { completeness += 10; concreteness += 8; } else { completeness -= 8; }
    if (hasPoliteNotCommand) courtesy += 10; else courtesy -= 12;
    if (hasZeroBlame) courtesy += 10; else courtesy -= 20;
    if (hasNoVagueWords) concreteness += 8; else concreteness -= 8;

    clarity = Math.min(98, Math.max(50, clarity));
    conciseness = Math.min(98, Math.max(50, conciseness));
    concreteness = Math.min(98, Math.max(50, concreteness));
    correctness = Math.min(98, Math.max(50, correctness));
    coherence = Math.min(98, Math.max(50, coherence));
    completeness = Math.min(98, Math.max(50, completeness));
    courtesy = Math.min(98, Math.max(50, courtesy));

    const overallScore = Math.round((clarity + conciseness + concreteness + correctness + coherence + completeness + courtesy) / 7);
    const grade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'Needs Practice';

    const areasOfStrength: string[] = [];
    const areasForImprovement: string[] = [];

    if (hasPoliteNotCommand) areasOfStrength.push('Consistently framed requests politely ("Could you please...")');
    else areasForImprovement.push('Avoid demanding phrasing; use cooperative inquiries.');

    if (hasZeroBlame) areasOfStrength.push('Maintained composure under pressure with zero blame shift');
    else areasForImprovement.push('Do not blame external systems or teammates; maintain solution ownership.');

    if (hasReasonAttached) areasOfStrength.push('Attached operational reason ("so that...") to motivate swift turnaround');
    else areasForImprovement.push('Always explain why you need information ("so that I can verify policy parameters").');

    const evalResult: MockCallEvaluation = {
      overallScore,
      grade,
      callDurationFormatted: formatTime(callSeconds),
      sevenCsBreakdown: { clarity, conciseness, concreteness, correctness, coherence, completeness, courtesy },
      goldenRulesEvaluation: {
        outcomeFirst: hasOutcomeFirst,
        reasonAttached: hasReasonAttached,
        actionTakenAhead: hasActionTakenAhead,
        politeNotCommand: hasPoliteNotCommand,
        zeroBlame: hasZeroBlame,
        noVagueWords: hasNoVagueWords,
      },
      areasOfStrength,
      areasForImprovement,
      callManagementTips: ['Confirm the priority sequence before closing the call with client or insured.'],
      turnByTurnFeedback: userTurns.slice(0, 3).map((turn) => ({
        userTurnSnippet: turn.text.slice(0, 60) + '...',
        critique: 'Clear communication aligned with call goals.',
        improvedVersion: `Could you please confirm the requirements so that I can process this without delay?`,
      })),
    };

    setEvaluation(evalResult);

    if (onSaveMockCallResult) {
      const record: MockCallRecord = {
        id: `call-${Date.now()}`,
        timestamp: new Date().toISOString(),
        character,
        gender,
        accent,
        tone,
        callType,
        topic: selectionMode === 'curriculum' ? (currentScenario.id as any) : selectedTopic,
        topicLabel: selectionMode === 'curriculum' ? `${currentScenario.scenarioCode}: ${currentScenario.title}` : currentTopicConfig.title,
        durationSeconds: callSeconds,
        overallScore,
        transcript,
        evaluation: evalResult,
      };
      onSaveMockCallResult(record);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Filtered curriculum scenarios
  const filteredScenarios = MOCK_CALL_SCENARIOS.filter((s) => {
    if (categoryFilter === 'all') return true;
    return s.category === categoryFilter;
  });

  // Print/Download Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Voice Simulation Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">13 Standard Training Scenarios & Adaptive AI Persona</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            AI Mock Call Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Live interactive voice calls with Clients, Insureds, Carriers, and POCs. The AI caller modifies its dialogues dynamically based on your spoken answers, testing clarification, de-escalation, 7 Cs, and the 6 Golden Rules.
          </p>
        </div>

        {callStatus === 'connected' && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl shadow-xs">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <div className="text-xs">
              <span className="font-bold text-rose-800 block">Live Call In Progress</span>
              <span className="font-mono text-slate-600">{formatTime(callSeconds)}</span>
            </div>
          </div>
        )}
      </div>

      {/* PHASE 1: CONFIGURATION & SCENARIO EXPLORER */}
      {callStatus === 'setup' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Select Call Scenario
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose from the 13 official curriculum scenarios or build a custom caller persona.
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setSelectionMode('curriculum')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectionMode === 'curriculum'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Curriculum Scenarios (13)
              </button>
              <button
                onClick={() => setSelectionMode('custom')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectionMode === 'custom'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Persona Builder
              </button>
            </div>
          </div>

          {/* MODE A: 13 CURRICULUM SCENARIOS */}
          {selectionMode === 'curriculum' ? (
            <div className="space-y-6">
              {/* Category Pills Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CURRICULUM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                      categoryFilter === cat.id
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Scenarios List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScenarios.map((scen) => {
                  const isSelected = selectedScenarioId === scen.id;
                  const toneColor = 
                    scen.tone === 'rude' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                    scen.tone === 'polite' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                    'text-blue-700 bg-blue-50 border-blue-200';

                  return (
                    <div
                      key={scen.id}
                      onClick={() => setSelectedScenarioId(scen.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all text-left space-y-2.5 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-mono">
                            {scen.scenarioCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${toneColor}`}>
                            {scen.tone} Tone
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{scen.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Caller: <strong className="text-slate-800">{scen.characterTitle}</strong> • {scen.categoryTitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {scen.objective}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {scen.expectedBehaviours.slice(0, 3).map((beh, bIdx) => (
                          <span key={bIdx} className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            • {beh}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Scenario Preview & Audio Settings */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Active Call Setup: {currentScenario.scenarioCode} — {currentScenario.title}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      Caller: {currentScenario.characterTitle} ({currentScenario.tone.toUpperCase()} Tone)
                    </h3>
                  </div>

                  {/* Accent & Gender Customization for caller */}
                  <div className="flex items-center gap-2">
                    <select
                      value={accent}
                      onChange={(e) => setAccent(e.target.value as AccentType)}
                      className="text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white text-slate-700"
                    >
                      <option value="us">🇺🇸 US General</option>
                      <option value="uk">🇬🇧 British RP</option>
                      <option value="ca">🇨🇦 Canadian</option>
                    </select>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as MockCallGender)}
                      className="text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white text-slate-700"
                    >
                      <option value="female">Female Voice</option>
                      <option value="male">Male Voice</option>
                    </select>
                  </div>
                </div>

                {/* Scenario Facts & Trainee Desk Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      Client / Insured Agency Details:
                    </span>
                    <div>Agency: <strong>{currentScenario.scenarioData?.agency || currentScenario.scenarioData?.company || 'N/A'}</strong></div>
                    <div>Policy #: <strong>{currentScenario.scenarioData?.policyNumber || 'Pending'}</strong></div>
                    <div>Deadlines: <strong className="text-rose-700">{currentScenario.scenarioData?.deadlines || 'Today'}</strong></div>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <ListOrdered className="w-3.5 h-3.5 text-emerald-700" />
                      Assigned Tasks / Focus Items:
                    </span>
                    {currentScenario.scenarioData?.tasks ? (
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                        {currentScenario.scenarioData.tasks.slice(0, 3).map((t, idx) => (
                          <li key={idx} className="line-clamp-1">{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-600">{currentScenario.objective}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: CUSTOM PERSONA BUILDER */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persona */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Caller Character Persona
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'client', label: 'Client (Account Manager)', desc: 'Commercial Broker Customer' },
                    { id: 'insured', label: 'Insured (Policyholder)', desc: 'Property / Auto Owner' },
                    { id: 'carrier', label: 'Carrier Underwriter', desc: 'Travelers / Liberty Mutual' },
                    { id: 'poc', label: 'POC (Agency Principal)', desc: 'Internal Senior Contact' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCharacter(item.id as MockCallCharacter)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        character === item.id
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Emotional Demeanor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'polite', label: 'Polite', icon: Smile, color: 'text-emerald-700' },
                    { id: 'normal', label: 'Normal / Busy', icon: Meh, color: 'text-blue-700' },
                    { id: 'rude', label: 'Rude / Difficult', icon: Frown, color: 'text-rose-700' },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id as MockCallTone)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          tone === t.id
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${t.color}`} />
                        <div className="text-xs font-bold text-slate-900">{t.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent & Voice */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Voice Accent & Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'us', flag: '🇺🇸', label: 'US' },
                    { id: 'uk', flag: '🇬🇧', label: 'UK' },
                    { id: 'ca', flag: '🇨🇦', label: 'CA' },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setAccent(acc.id as AccentType)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        accent === acc.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span className="text-base mr-1">{acc.flag}</span> {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day 6-8 Operational Topics */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Operational Topic (Day 6, 7 & 8)
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value as MockCallTopic)}
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white"
                >
                  {TOPICS_CONFIG.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.badge} — {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Launch Call Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Ready to simulate: <strong className="text-slate-800 capitalize">{character}</strong> ({gender}, {accent.toUpperCase()}, {tone})
            </div>
            <button
              onClick={handleStartCall}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-5 h-5" />
              Dial & Connect Call
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: RINGING / CONNECTING */}
      {callStatus === 'ringing' && (
        <div className="bg-slate-900 text-white rounded-3xl p-12 text-center space-y-6 shadow-xl max-w-xl mx-auto animate-pulse">
          <div className="inline-flex p-6 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <PhoneIncoming className="w-12 h-12 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">
              Connecting to {selectionMode === 'curriculum' ? currentScenario.characterTitle : character.toUpperCase()}...
            </h3>
            <p className="text-xs text-slate-400">
              Connecting audio stream • {accent.toUpperCase()} Voice Profile ({gender}) • Demeanor: {tone.toUpperCase()}
            </p>
          </div>
          <div className="text-xs text-emerald-400 font-mono">
            Ringing... Please prepare your greeting and desk notes.
          </div>
        </div>
      )}

      {/* PHASE 3: ACTIVE CONNECTED CALL */}
      {callStatus === 'connected' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden space-y-0">
          {/* Active Call Header */}
          <div className="bg-slate-900 text-white p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {character[0].toUpperCase()}
                </div>
                {isAiSpeaking && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">
                    {selectionMode === 'curriculum' ? currentScenario.characterTitle : character}
                  </h3>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    {gender} • {accent.toUpperCase()} • {tone}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectionMode === 'curriculum' ? `${currentScenario.scenarioCode}: ${currentScenario.title}` : currentTopicConfig.title}
                </p>
              </div>
            </div>

            {/* Call Controls Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(callSeconds)}</span>
              </div>

              <button
                onClick={() => setShowDeskNotes(!showDeskNotes)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  showDeskNotes 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Toggle Trainee Desk Notes"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Desk Notes</span>
              </button>

              <button
                onClick={() => setSpeakerEnabled(!speakerEnabled)}
                className={`p-2 rounded-xl border transition-colors ${
                  speakerEnabled 
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                    : 'bg-rose-900/60 text-rose-300 border-rose-800'
                }`}
                title={speakerEnabled ? 'Speaker Active' : 'Speaker Muted'}
              >
                {speakerEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleEndCall}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                End & Evaluate
              </button>
            </div>
          </div>

          {/* Trainee Desk Notes / Reference Drawer */}
          {showDeskNotes && (
            <div className="bg-emerald-950/90 text-emerald-100 px-6 py-3 border-b border-emerald-800/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Desk Reference & Scenario Facts:</span>{' '}
                  <span className="text-emerald-200">
                    {currentScenario.scenarioData?.clientName ? `Client: ${currentScenario.scenarioData.clientName} (${currentScenario.scenarioData.agency || ''})` : ''}
                    {currentScenario.scenarioData?.company ? ` • Account: ${currentScenario.scenarioData.company}` : ''}
                    {currentScenario.scenarioData?.policyNumber ? ` • Ref: ${currentScenario.scenarioData.policyNumber}` : ''}
                    {currentScenario.scenarioData?.deadlines ? ` • Deadline: ${currentScenario.scenarioData.deadlines}` : ''}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium shrink-0 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                Rule Focus: Outcome First • Reason ("so that...") • Zero Blame
              </div>
            </div>
          )}

          {/* Real-time Coaching Alert Pill */}
          {coachingAlert && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{coachingAlert}</span>
            </div>
          )}

          {/* Caller Completed Notice */}
          {isCallEndingNotice && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>The caller has wrapped up their points. Click <strong>End & Evaluate</strong> to view your score.</span>
              </div>
              <button
                onClick={handleEndCall}
                className="font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Conclude Call Now →
              </button>
            </div>
          )}

          {/* Transcript Scroll Area */}
          <div className="p-6 md:p-8 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50/50">
            {transcript.map((turn) => {
              const isAi = turn.speaker === 'ai';
              return (
                <div
                  key={turn.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-500 capitalize">
                      {isAi ? (selectionMode === 'curriculum' ? currentScenario.characterTitle : character) : 'You (Trainee)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{turn.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isAi
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                        : 'bg-emerald-700 text-white shadow-xs rounded-tr-xs'
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              );
            })}

            {isGeneratingReply && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {selectionMode === 'curriculum' ? currentScenario.characterTitle : character}
                  </span>
                </div>
                <div className="bg-white text-slate-500 border border-slate-200 p-3 rounded-2xl text-xs flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Caller is replying...</span>
                </div>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* Trainee Input Bar */}
          <div className="p-4 md:p-6 bg-white border-t border-slate-200 space-y-3">
            {/* Quick response helpers based on Golden Rules */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold whitespace-nowrap text-[11px]">
                Helpful Starters:
              </span>
              {[
                `Could you please clarify the priority sequence so that I can process the most urgent task first?`,
                `Sure, please go ahead.`,
                `I understand and take full responsibility. I will follow up with the carrier before 3:00 PM today.`,
                `Just to confirm, I will first process the COI, then the renewal, and follow up with John Davis before 3 PM.`,
              ].map((starter, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setUserInput(starter)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-[11px] whitespace-nowrap transition-colors border border-slate-200"
                >
                  "{starter.slice(0, 32)}..."
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-2xl transition-all shadow-sm ${
                  isListeningMic
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={isListeningMic ? 'Listening... Click to stop' : 'Click to speak via microphone'}
              >
                {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendResponse();
                }}
                placeholder={isListeningMic ? 'Listening to your voice... Speak now' : 'Type your spoken dialogue or click mic to speak...'}
                className="flex-1 text-sm p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />

              <button
                onClick={handleSendResponse}
                disabled={!userInput.trim() || isGeneratingReply || isAiSpeaking}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>Respond</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: EVALUATION & REPORT */}
      {callStatus === 'ended' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
          {isEvaluating ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                Evaluating Call Performance Against 7 Cs & 6 Golden Rules...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Analyzing conversational clarification, de-escalation, priority sequencing, active listening, and precision.
              </p>
            </div>
          ) : evaluation ? (
            <>
              {/* Executive Summary Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                      7 Cs & Golden Rules Call Evaluation
                    </span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-md text-slate-300">
                      Grade: {evaluation.grade}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectionMode === 'curriculum' ? `${currentScenario.scenarioCode}: ${currentScenario.title}` : currentTopicConfig.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Caller: {selectionMode === 'curriculum' ? currentScenario.characterTitle : character.toUpperCase()} ({tone.toUpperCase()} Tone) • Duration: {evaluation.callDurationFormatted}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700 self-start sm:self-auto">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">
                      {evaluation.overallScore}%
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                      Call Mastery Score
                    </div>
                  </div>
                </div>
              </div>

              {/* 7 Cs Scorecard Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  The 7 Cs of Business Communication
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {[
                    { name: 'Clear', score: evaluation.sevenCsBreakdown.clarity },
                    { name: 'Concise', score: evaluation.sevenCsBreakdown.conciseness },
                    { name: 'Concrete', score: evaluation.sevenCsBreakdown.concreteness },
                    { name: 'Correct', score: evaluation.sevenCsBreakdown.correctness },
                    { name: 'Coherent', score: evaluation.sevenCsBreakdown.coherence },
                    { name: 'Complete', score: evaluation.sevenCsBreakdown.completeness },
                    { name: 'Courteous', score: evaluation.sevenCsBreakdown.courtesy },
                  ].map((c) => (
                    <div key={c.name} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">{c.name}</span>
                      <div className={`text-xl font-bold ${c.score >= 80 ? 'text-emerald-700' : c.score >= 65 ? 'text-amber-700' : 'text-rose-700'}`}>
                        {c.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 Golden Rules Checklist */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  6 Golden Rules Operational Audit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Rule 1: Bottom Line Up Front', passed: evaluation.goldenRulesEvaluation.outcomeFirst },
                    { label: 'Rule 2: Reason Attached ("so that...")', passed: evaluation.goldenRulesEvaluation.reasonAttached },
                    { label: 'Rule 3: Action Taken & Action Ahead', passed: evaluation.goldenRulesEvaluation.actionTakenAhead },
                    { label: 'Rule 4: Polite Phrasing (Not Command)', passed: evaluation.goldenRulesEvaluation.politeNotCommand },
                    { label: 'Rule 5: Zero Blame Under Pressure', passed: evaluation.goldenRulesEvaluation.zeroBlame },
                    { label: 'Rule 6: Concrete Cutoff Timestamps', passed: evaluation.goldenRulesEvaluation.noVagueWords },
                  ].map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                        r.passed
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50/80 border-rose-300 text-rose-900'
                      }`}
                    >
                      {r.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AOS (Areas of Strength) and AOI (Areas for Improvement) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AOS */}
                <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <ThumbsUp className="w-4 h-4 text-emerald-700" />
                    <span>Areas of Strength (AOS)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {evaluation.areasOfStrength.length > 0 ? (
                      evaluation.areasOfStrength.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Practice maintaining composure and stating exact timelines.</li>
                    )}
                  </ul>
                </div>

                {/* AOI */}
                <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Areas for Improvement (AOI)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {evaluation.areasForImprovement.length > 0 ? (
                      evaluation.areasForImprovement.map((aoi, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{aoi}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-emerald-700 font-medium">No major operational deficiencies identified in this call!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Turn-by-Turn Coaching Feedback */}
              {evaluation.turnByTurnFeedback.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Turn-by-Turn Feedback & Model ClearCue Rewrites
                  </h3>
                  <div className="space-y-3">
                    {evaluation.turnByTurnFeedback.map((fb, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="text-xs text-slate-500">
                          Your Spoken Turn: <span className="font-medium text-slate-800 italic">"{fb.userTurnSnippet}"</span>
                        </div>
                        <div className="text-xs text-amber-800 font-medium">
                          Critique: {fb.critique}
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                          ✨ Golden Rule Model Phrasing: <span className="font-semibold">"{fb.improvedVersion}"</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions: Download / Print / Navigate */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCallStatus('setup');
                      setTranscript([]);
                      setEvaluation(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Practice Another Scenario
                  </button>

                  <button
                    onClick={handlePrintReport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / PDF</span>
                  </button>
                </div>

                {onNavigateToDashboard && (
                  <button
                    onClick={onNavigateToDashboard}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <span>View Progression on Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Mr. Cuckoo Coaching Advice */}
      <MrCuckoo
        variant="card"
        title="Mr. Cuckoo's Mock Call Coaching"
        message="Dynamic call excellence relies on four steps: Acknowledge → Clarify → Prioritize → Confirm. When a client assigns multiple items or displays urgency, never rush to hang up. Always summarize the sequence by deadline and verify before diving into work!"
      />
    </div>
  );
};
