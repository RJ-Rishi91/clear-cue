import React, { useState, useEffect } from 'react';
import { 
  Audience, 
  Channel, 
  CommunicationTone, 
  CommunicationPurpose, 
  MessageAnalysisResult, 
  SevenCKey, 
  CheckedMessageRecord 
} from '../types';
import { getSoftAnimatedCuckooVoice } from '../utils/voiceUtils';
import { API_BASE, getAuthHeaders } from '../utils/api';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  ClipboardPaste, 
  SplitSquareVertical, 
  Info, 
  BookmarkCheck,
  Volume2,
  ShieldAlert,
  ThumbsUp,
  Building2,
  Users,
  Briefcase,
  HelpCircle,
  Clock,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { MrCuckoo } from './MrCuckoo';

interface CheckMessageViewProps {
  initialMessage?: string;
  initialAudience?: Audience;
  onRecordAnalyzed?: (record: CheckedMessageRecord) => void;
  onNavigateToMailWriter?: () => void;
  onNavigateToPronunciation?: (sentence: string) => void;
}

const SAMPLE_DRAFTS: Array<{
  label: string;
  ruleTag: string;
  audience: Audience;
  channel: Channel;
  tone: CommunicationTone;
  purpose: CommunicationPurpose;
  text: string;
}> = [
  {
    label: 'Buried Outcome & Missing Reason',
    ruleTag: 'Rule 1 & 2: Outcome & Reason',
    audience: 'agency_owner',
    channel: 'email',
    tone: 'professional',
    purpose: 'update',
    text: "I hope you are doing well and having a good week. I wanted to quickly touch base regarding the account we discussed yesterday. The renewal is at risk.",
  },
  {
    label: 'Request Missing Reason: "Could you please tell me policy #"',
    ruleTag: 'Rule 2: Attach Reason',
    audience: 'their_customer',
    channel: 'email',
    tone: 'friendly',
    purpose: 'request',
    text: "Could you please tell me your policy number?",
  },
  {
    label: 'Update Missing "Action Ahead"',
    ruleTag: 'Rule 3: Action Ahead',
    audience: 'agency_owner',
    channel: 'email',
    tone: 'professional',
    purpose: 'update',
    text: "I have contacted the client regarding the missing endorsement forms.",
  },
  {
    label: 'Command: "Send me the document."',
    ruleTag: 'Rule 4: No Commands',
    audience: 'agency_owner',
    channel: 'email',
    tone: 'professional',
    purpose: 'request',
    text: "Send me the document.",
  },
  {
    label: 'Blaming: "You didn\'t submit the documents."',
    ruleTag: 'Rule 5: Zero Blame',
    audience: 'their_customer',
    channel: 'email',
    tone: 'professional',
    purpose: 'request',
    text: "You didn't submit the documents.",
  },
  {
    label: 'Vague Words: "Need some documents and a few forms..."',
    ruleTag: 'Rule 6: Ban Vague Words',
    audience: 'partner_org',
    channel: 'email',
    tone: 'professional',
    purpose: 'asking_info',
    text: "We need some documents and a few forms asap to proceed with Policy #GL-1049.",
  },
];

export const CheckMessageView: React.FC<CheckMessageViewProps> = ({
  initialMessage = '',
  initialAudience = 'agency_owner',
  onRecordAnalyzed,
  onNavigateToMailWriter,
  onNavigateToPronunciation,
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [channel, setChannel] = useState<Channel>('email');
  const [tone, setTone] = useState<CommunicationTone>('professional');
  const [purpose, setPurpose] = useState<CommunicationPurpose>('update');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (initialAudience) {
      setAudience(initialAudience);
    }
  }, [initialAudience]);

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const charCount = message.length;

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please enter a message or select one of the quick samples above.');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedBadge(false);

    try {
      const res = await fetch(`${API_BASE}/analyze-message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message,
          audience,
          channel,
          tone,
          purpose,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed. Please check server status.');
      }

      const data: MessageAnalysisResult = await res.json();
      setResult(data);

      // Record in progress history
      if (onRecordAnalyzed) {
        const entries = Object.entries(data.scores) as [SevenCKey, number][];
        entries.sort((a, b) => b[1] - a[1]);
        const strongestC = entries[0][0];
        const growthC = entries[entries.length - 1][0];

        onRecordAnalyzed({
          id: `msg-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audience,
          channel,
          originalSnippet: message.slice(0, 60) + (message.length > 60 ? '...' : ''),
          overallScore: data.overallScore,
          strongestC,
          growthC,
        });
        setSavedBadge(true);
      }
    } catch (err: any) {
      console.error('Error analyzing message:', err);
      setError(err?.message || 'Unable to analyze message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
      }
    } catch {
      // ignore
    }
  };

  const handleCopyImproved = () => {
    if (!result?.improvedMessage) return;
    navigator.clipboard.writeText(result.improvedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-800 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-emerald-900 bg-[#fbfaf6] border-slate-300';
    return 'text-amber-800 bg-amber-50 border-amber-300';
  };

  const getScoreBarBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-600';
    if (score >= 70) return 'bg-[#14362b]';
    return 'bg-amber-500';
  };

  const speakExemplar = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const softVoice = getSoftAnimatedCuckooVoice(voices);
    if (softVoice) utterance.voice = softVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-6">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ClearCue Message Evaluator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          Check My Communication
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Audit your message against the 7 Cs and the 6 Golden Communication Rules before sending to agency owners, carriers, or clients.
        </p>
      </div>

      {/* Quick Sample Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Test Common VA Drafts (The 6 Golden Rules):
          </span>
          <span className="text-[11px] text-slate-400">Click to pre-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SAMPLE_DRAFTS.map((sample, idx) => (
            <button
              key={idx}
              id={`quick-sample-${idx}`}
              onClick={() => {
                setMessage(sample.text);
                setAudience(sample.audience);
                setChannel(sample.channel);
                setTone(sample.tone);
                setPurpose(sample.purpose);
              }}
              className="p-2.5 rounded-xl text-left text-xs bg-[#fbfaf6] hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                  {sample.label}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  {sample.ruleTag}
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 truncate">"{sample.text}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Controls Grid: Audience, Channel, Tone, Purpose */}
        <div className="space-y-4">
          {/* Row 1: Target Audience Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Target Audience (Person to Respond)
              </label>
              <span className="text-[11px] text-slate-400">Select recipient role</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Agency Owners */}
              <button
                type="button"
                id="check-audience-agency-owner"
                onClick={() => setAudience('agency_owner')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'agency_owner' || audience === 'client'
                    ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-[#fbfaf6] border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Agency Owners</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Primary client. Solutions-first, respect their time, summarize.
                </p>
              </button>

              {/* Their Customers */}
              <button
                type="button"
                id="check-audience-their-customer"
                onClick={() => setAudience('their_customer')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'their_customer' || audience === 'insured'
                    ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-[#fbfaf6] border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Their Customers</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  End clients. Patient, reassuring, plain-language, zero jargon.
                </p>
              </button>

              {/* Partner Organizations */}
              <button
                type="button"
                id="check-audience-partner-org"
                onClick={() => setAudience('partner_org')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'partner_org' || audience === 'carrier' || audience === 'adjuster'
                    ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-[#fbfaf6] border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Partner Organizations</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Carriers & adjusters. Precise, factual, fully documented.
                </p>
              </button>
            </div>
          </div>

          {/* Row 2: Tone, Purpose, Channel (User Requested Options) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                2. Tone
              </label>
              <select
                id="select-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as CommunicationTone)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-[#fbfaf6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual_professional">Casual Professional</option>
                <option value="building_rapport">Building Rapport</option>
              </select>
            </div>

            {/* Purpose Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                3. Purpose
              </label>
              <select
                id="select-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as CommunicationPurpose)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-[#fbfaf6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="update">Update</option>
                <option value="request">Request</option>
                <option value="confirmation">Confirmation</option>
                <option value="clarification">Clarification for instructions</option>
                <option value="asking_info">Asking info</option>
              </select>
            </div>

            {/* Channel Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                4. Form of Communication
              </label>
              <select
                id="select-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-[#fbfaf6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="email">Email</option>
                <option value="chat">Internal Chat (Slack / Teams)</option>
                <option value="endorsement_note">Endorsement Note (AMS360 / Applied)</option>
                <option value="claims_status">Claims Status Update</option>
                <option value="carrier_followup">Carrier Follow-up Note</option>
                <option value="renewal_notice">Renewal Notice</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="message-draft" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Message Draft
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <button
                type="button"
                id="paste-clipboard-btn"
                onClick={handlePaste}
                className="hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
              <span>•</span>
              <span id="char-word-count">
                {wordCount} words | {charCount} chars
              </span>
            </div>
          </div>

          <textarea
            id="message-draft"
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Type or paste your message here (e.g. 'Could you please send me the 2 endorsement forms so that I can check further details?')..."
            className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-slate-800 font-sans text-sm sm:text-base leading-relaxed placeholder:text-slate-400 bg-[#fbfaf6]"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {savedBadge && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Saved to Progress
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {message && (
              <button
                type="button"
                id="clear-message-btn"
                onClick={() => {
                  setMessage('');
                  setResult(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              id="analyze-message-submit-btn"
              onClick={handleAnalyze}
              disabled={loading || !message.trim()}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-white shadow-sm transition-all cursor-pointer ${
                loading || !message.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#14362b] hover:bg-[#0e271f]'
              }`}
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Evaluating with Mr. Cuckoo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Check Message Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Analysis Results
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  Clarity & 6 Golden Rules Scorecard
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500">Engine:</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {result.engine || 'ClearCue Intelligence'}
                </span>
              </div>
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#fbfaf6] border border-slate-200 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Overall Score
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-5xl font-extrabold font-serif text-slate-900">
                    {result.overallScore}
                  </span>
                  <span className="text-lg text-slate-400 font-semibold">/100</span>
                </div>
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore >= 85 ? 'Exemplary VA Standard' : result.overallScore >= 70 ? 'Ready with Minor Polish' : 'Needs Rule Realignment'}
                </div>
              </div>

              {/* 7 Cs Detailed Sub-Scores */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  The 7 Cs Breakdown
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(result.scores) as SevenCKey[]).map((key) => {
                    const score = result.scores[key];
                    return (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize font-semibold text-slate-700">{key}</span>
                          <span className="font-bold text-slate-900">{score}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full ${getScoreBarBg(score)} transition-all duration-500`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* THE 6 GOLDEN COMMUNICATION RULES COMPLIANCE GRID */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  The 6 Golden Rules Audit
                </span>
                <span className="text-[11px] text-slate-500">
                  Operational compliance filter
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Rule 1: Outcome First */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.hasOutcomeFirst
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-rose-50 text-rose-950 border-rose-300'
                  }`}
                >
                  {result.checks.hasOutcomeFirst ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 1: {result.checks.hasOutcomeFirst ? 'Outcome First (BLUF)' : 'Buried Outcome'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.hasOutcomeFirst
                        ? 'Starts immediately with key update or final request'
                        : 'Move the bottom line up front into the first sentence.'}
                    </span>
                  </div>
                </div>

                {/* Rule 2: Reason Attached */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.hasReasonOrImpact
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}
                >
                  {result.checks.hasReasonOrImpact ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 2: {result.checks.hasReasonOrImpact ? 'Operational Reason Attached' : 'Reason Optional / Missing'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.hasReasonOrImpact
                        ? 'Explains operational reason ("so that I can check further details")'
                        : 'Attach "so that..." where important (not required for all scenarios; completeness covers full details)'}
                    </span>
                  </div>
                </div>

                {/* Rule 3: Updates have Action Taken & Ahead */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.hasActionTakenAndAhead
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}
                >
                  {result.checks.hasActionTakenAndAhead ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 3: {result.checks.hasActionTakenAndAhead ? 'Action Taken & Ahead' : 'Single-Phase Update'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.hasActionTakenAndAhead
                        ? 'Includes what was done and what follows tomorrow'
                        : 'Add: Action Taken & Action Ahead for full accountability.'}
                    </span>
                  </div>
                </div>

                {/* Rule 4: Polite Request */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.isPoliteRequestNotCommand
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-rose-50 text-rose-950 border-rose-300'
                  }`}
                >
                  {result.checks.isPoliteRequestNotCommand ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 4: {result.checks.isPoliteRequestNotCommand ? 'Polite Request' : 'Command Detected'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.isPoliteRequestNotCommand
                        ? 'Framed politely ("Could you please..." / "May I...")'
                        : 'Sounds like an order. Start with "Could you please".'}
                    </span>
                  </div>
                </div>

                {/* Rule 5: Zero Blame */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.isNonBlamingAndNeutral
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-rose-50 text-rose-950 border-rose-300'
                  }`}
                >
                  {result.checks.isNonBlamingAndNeutral ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 5: {result.checks.isNonBlamingAndNeutral ? 'Zero Blame Tone' : 'Blaming Tone'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.isNonBlamingAndNeutral
                        ? 'Neutral and solution-oriented for the reader'
                        : 'Reframe: "As I see that there are documents pending..."'}
                    </span>
                  </div>
                </div>

                {/* Rule 6: No Vague Words */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    result.checks.hasNoVagueQuantifiers
                      ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}
                >
                  {result.checks.hasNoVagueQuantifiers ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      Rule 6: {result.checks.hasNoVagueQuantifiers ? 'Concrete Precision' : 'Vague Words'}
                    </span>
                    <span className="text-[11px] opacity-85 block leading-tight mt-0.5">
                      {result.checks.hasNoVagueQuantifiers
                        ? 'Zero vague words ("some", "many", "a few")'
                        : 'Replace with exact numbers, Policy #, and cutoff times.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professor Cuckoo Voice Coach Banner */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <MrCuckoo
                size="sm"
                mood="coach"
                customTip={`Professor Cuckoo's Verdict: Score ${result.overallScore}/100! ${
                  result.keyTakeaways[0] || 'Remember to always start requests with Could you please!'
                }`}
              />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Professor Cuckoo's Voice Feedback
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  {result.keyTakeaways[0] || "Remember: make requests starting with 'Could you please', never blame, and state exact numbers."}
                </p>
              </div>
            </div>

            <button
              id="cuckoo-hear-exemplar-btn"
              onClick={() => speakExemplar(result.improvedMessage)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14362b] hover:bg-[#0e271f] text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-emerald-200" />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen with Mr. Cuckoo'}</span>
            </button>
          </div>

          {/* Coach's Improved Rewrite Card */}
          <div className="bg-white rounded-2xl border-2 border-emerald-700/30 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ClearCue Exemplar Rewrite
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="toggle-diff-btn"
                  onClick={() => setShowDiff(!showDiff)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showDiff ? 'Hide Comparison' : 'Compare Before / After'}</span>
                </button>

                <button
                  id="copy-improved-message-btn"
                  onClick={handleCopyImproved}
                  className="px-3.5 py-1.5 rounded-lg bg-[#14362b] hover:bg-[#0e271f] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copy Exemplar</span>
                    </>
                  )}
                </button>

                {onNavigateToPronunciation && (
                  <button
                    id="exemplar-pronunciation-btn"
                    onClick={() => onNavigateToPronunciation(result.improvedMessage)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Check how this sentence sounds in US, UK, and Canadian accents"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pronunciation Check</span>
                  </button>
                )}
              </div>
            </div>

            {/* Split Comparison View */}
            {showDiff ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Original Draft
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    ClearCue Exemplar Rewrite
                  </span>
                  <p className="text-xs sm:text-sm text-slate-900 whitespace-pre-wrap font-sans font-medium leading-relaxed">
                    {result.improvedMessage}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-[#fbfaf6] border border-slate-200">
                <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.improvedMessage}
                </p>
              </div>
            )}

            {/* Tactical Improvements Identified */}
            {result.improvements.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Tactical Polishes Applied
                </span>
                <div className="space-y-2.5">
                  {result.improvements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {item.category}: "{item.original}" → "{item.suggestion}"
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mail Writer Link */}
            {onNavigateToMailWriter && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Need to write a completely new email from scratch?
                </span>
                <button
                  id="nav-to-mail-writer-btn"
                  onClick={onNavigateToMailWriter}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                >
                  <span>Open AI Mail Writer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
