import React, { useState } from 'react';
import { 
  Audience, 
  CommunicationTone, 
  CommunicationPurpose, 
  EmailDraftResponse 
} from '../types';
import { getSoftAnimatedCuckooVoice } from '../utils/voiceUtils';
import { MrCuckoo } from './MrCuckoo';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users, 
  Briefcase, 
  FileText, 
  HelpCircle, 
  RefreshCw,
  Info,
  Clock,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface DraftEmailViewProps {
  onSendToChecker?: (text: string, audience: Audience) => void;
}

const SAMPLE_TOPICS = [
  {
    title: 'Missing Loss Runs for Renewal',
    topic: 'Renewal is approaching in 14 days and the carrier still has not received the prior 3 years loss runs. Need them promptly to prevent a coverage lapse.',
    audience: 'agency_owner' as Audience,
    purpose: 'update' as CommunicationPurpose,
    tone: 'professional' as CommunicationTone,
    form: 'Quick Operational Update',
  },
  {
    title: 'Request Additional Insured Info from End Client',
    topic: 'End client requested a Certificate of Insurance with Additional Insured endorsement, but did not provide the exact legal entity name or job address.',
    audience: 'their_customer' as Audience,
    purpose: 'request' as CommunicationPurpose,
    tone: 'friendly' as CommunicationTone,
    form: 'Action-Required Notice',
  },
  {
    title: 'Clarification on Task Priority from Agency Owner',
    topic: 'Received 5 different renewal accounts to review at the same time today. Need the owner to specify which 2 accounts to prioritize first before 2:00 PM EST.',
    audience: 'agency_owner' as Audience,
    purpose: 'clarification' as CommunicationPurpose,
    tone: 'casual_professional' as CommunicationTone,
    form: 'Quick Operational Update',
  },
  {
    title: 'Carrier Underwriter Documentation Follow-up',
    topic: 'Underwriter has been reviewing commercial property quote submission for 4 days without an update. Follow up for formal quote terms before Friday.',
    audience: 'partner_org' as Audience,
    purpose: 'asking_info' as CommunicationPurpose,
    tone: 'professional' as CommunicationTone,
    form: 'Documentation Follow-up',
  },
];

export const DraftEmailView: React.FC<DraftEmailViewProps> = ({ onSendToChecker }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<Audience>('agency_owner');
  const [tone, setTone] = useState<CommunicationTone>('professional');
  const [purpose, setPurpose] = useState<CommunicationPurpose>('update');
  const [form, setForm] = useState('Formal Email');
  const [contextDetails, setContextDetails] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<EmailDraftResponse | null>(null);
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          audience,
          tone,
          purpose,
          form,
          contextDetails: contextDetails.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to draft email');
      }

      const data: EmailDraftResponse = await res.json();
      setDraftResult(data);
    } catch (err) {
      console.error('Draft email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const speakDraft = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.20;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200/80 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Mail Writer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Draft an Email
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Generate emails that immediately lead with the outcome, state the exact reason, and strictly uphold the 6 Golden Communication Rules.
          </p>
        </div>

        {/* Professor Cuckoo Cameo */}
        <div className="hidden sm:block shrink-0">
          <MrCuckoo
            size="md"
            mood="coach"
            customTip="Give me the situation and who you are emailing. I'll make sure the outcome is right up front!"
          />
        </div>
      </div>

      {/* Quick Topic Inspirations */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          Quick Load Real Insurance Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_TOPICS.map((s, idx) => (
            <button
              key={idx}
              id={`quick-topic-${idx}`}
              onClick={() => {
                setTopic(s.topic);
                setAudience(s.audience);
                setPurpose(s.purpose);
                setTone(s.tone);
                setForm(s.form);
              }}
              className="p-3 text-left rounded-xl bg-[#fbfaf6] hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                {s.title}
              </span>
              <span className="block text-[11px] text-slate-500 mt-1 line-clamp-2">
                {s.topic}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Mail Writer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs & Filters */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          {/* 1. Topic / Situation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Topic & Situation <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Describe what happened, what is needed, or what you want the recipient to know:
            </p>
            <textarea
              id="email-topic-input"
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Need the insured to send the signed renewal questionnaire and vehicle list for Policy #GL-1049 before Friday 3:00 PM EST..."
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-[#fbfaf6] focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* 2. Person to Interact With (Audience) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Person to Interact With (Audience)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Agency Owners */}
              <button
                type="button"
                id="audience-agency-owner"
                onClick={() => setAudience('agency_owner')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'agency_owner' || audience === 'client'
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Agency Owners (Primary Client)</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  US/Canada principals. Consultative, proactive, solutions-first. Respect their time!
                </p>
              </button>

              {/* Their Customers */}
              <button
                type="button"
                id="audience-their-customer"
                onClick={() => setAudience('their_customer')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'their_customer' || audience === 'insured'
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Their Customers (End Clients)</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Insureds & policyholders. Patient, plain language, reassuring — zero jargon!
                </p>
              </button>

              {/* Partner Organizations */}
              <button
                type="button"
                id="audience-partner-org"
                onClick={() => setAudience('partner_org')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'partner_org' || audience === 'carrier' || audience === 'adjuster'
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Briefcase className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Partner Organizations</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Carriers, underwriters, adjusters. Professional, precise, well-documented.
                </p>
              </button>

              {/* Internal Team */}
              <button
                type="button"
                id="audience-internal-team"
                onClick={() => setAudience('internal_team')}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  audience === 'internal_team'
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Internal Team / Shift</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Colleagues & shift leads. Structured, clear ownership, exact blockers.
                </p>
              </button>
            </div>
          </div>

          {/* 3. Tone & Purpose Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Tone
              </label>
              <select
                id="email-tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value as CommunicationTone)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#fbfaf6] text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-700 outline-none"
              >
                <option value="professional">Professional (Standard Insurance)</option>
                <option value="friendly">Friendly & Warm</option>
                <option value="casual_professional">Casual Professional (Colleague/Partner)</option>
                <option value="building_rapport">Building Rapport & Trust</option>
              </select>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Purpose
              </label>
              <select
                id="email-purpose-select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as CommunicationPurpose)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#fbfaf6] text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-700 outline-none"
              >
                <option value="update">Status Update (With Action Taken & Ahead)</option>
                <option value="request">Polite Request (With Stated Reason)</option>
                <option value="confirmation">Confirmation of Action / Task</option>
                <option value="clarification">Clarification for Instructions</option>
                <option value="asking_info">Asking for Specific Information</option>
              </select>
            </div>
          </div>

          {/* 5. Form of Email & Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                5. Form of Email
              </label>
              <select
                id="email-form-select"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#fbfaf6] text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-700 outline-none"
              >
                <option value="Formal Email">Formal Email (Client/Underwriter)</option>
                <option value="Quick Operational Update">Quick Operational Update</option>
                <option value="Action-Required Notice">Action-Required Request</option>
                <option value="Escalation Notice">Escalation / Urgent Notice</option>
                <option value="Documentation Follow-up">Documentation Follow-up</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Optional Policy / Claim #
              </label>
              <input
                type="text"
                id="email-context-input"
                value={contextDetails}
                onChange={(e) => setContextDetails(e.target.value)}
                placeholder="e.g. Policy #GL-1049, Carrier: Hartford"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#fbfaf6] text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-700 outline-none"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="draft-email-submit-btn"
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all cursor-pointer shadow-sm ${
              isLoading || !topic.trim()
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#14362b] hover:bg-[#0e271f]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Crafting Email with Professor Cuckoo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Draft My Email Now</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview & Generated Draft */}
        <div className="lg:col-span-5 space-y-6">
          {draftResult ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-700/30 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Drafted Insurance Email
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {draftResult.engine || 'ClearCue AI'}
                </span>
              </div>

              {/* Subject Line */}
              <div className="bg-[#fbfaf6] p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Subject Line
                  </span>
                  <button
                    id="copy-subject-btn"
                    onClick={() => copyToClipboard(draftResult.subject, 'subject')}
                    className="text-slate-500 hover:text-emerald-700 p-1 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedField === 'subject' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs font-bold text-slate-900 select-all">
                  {draftResult.subject}
                </p>
              </div>

              {/* Email Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Email Body
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id="listen-email-btn"
                      onClick={() => speakDraft(draftResult.body)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 p-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen with Mr. Cuckoo'}</span>
                    </button>
                    <button
                      id="copy-body-btn"
                      onClick={() => copyToClipboard(draftResult.body, 'body')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1 cursor-pointer"
                    >
                      {copiedField === 'body' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied Body</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Body</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-[#fbfaf6] p-4.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-all">
                  {draftResult.body}
                </div>
              </div>

              {/* 6 Golden Rules Checklist honored */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Golden Rules Honored in this Draft:</span>
                </span>
                <div className="space-y-1.5">
                  {draftResult.rulesHonored.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-emerald-950">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coaching Explanation */}
              <div className="text-xs text-slate-600 italic border-l-2 border-emerald-600 pl-3 py-0.5">
                {draftResult.explanation}
              </div>

              {/* Action Button: Send to Message Evaluator */}
              {onSendToChecker && (
                <button
                  id="send-to-checker-btn"
                  onClick={() => onSendToChecker(draftResult.body, audience)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Evaluate this Draft in 7 Cs Scorecard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#fbfaf6] rounded-2xl border border-dashed border-slate-300 p-8 sm:p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ready to Draft Your Email
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Enter your topic on the left or select a pre-filled scenario. Professor Cuckoo will construct an email strictly leading with the outcome and stating the exact reason.
                </p>
              </div>

              {/* Golden Rules Summary Pill */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block">The 6 Golden Rules Enforced:</span>
                <p>1. <strong>Outcome First (BLUF):</strong> Final request/update in sentence #1.</p>
                <p>2. <strong>Reason Attached:</strong> Use 'so that...' to explain operational impact.</p>
                <p>3. <strong>Dual-Phase Updates:</strong> Demarcates Action Taken & Action Ahead.</p>
                <p>4. <strong>Polite Phrasing:</strong> Starts with 'Could you please' / 'May I'.</p>
                <p>5. <strong>Zero Blame:</strong> Neutral, solution-oriented phrasing.</p>
                <p>6. <strong>Concrete Precision:</strong> Exact document counts, policy IDs, cutoff times.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
