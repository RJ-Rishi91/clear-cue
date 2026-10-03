import React, { useState } from 'react';
import { NavView, SevenCKey } from '../types';
import { BEFORE_AFTER_ITEMS } from '../data/beforeAfterData';
import { SEVEN_CS_PRINCIPLES } from '../data/sevenCsData';
import { AUDIENCE_PROFILES } from '../data/audiencesData';
import { MrCuckoo } from './MrCuckoo';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  BookOpen, 
  Send, 
  Target, 
  Award, 
  Layers, 
  Users, 
  Shield, 
  Copy, 
  Check,
  PenLine,
  Building2,
  Briefcase,
  ShieldAlert,
  Flame,
  Clock,
  Headphones,
  Gamepad2
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: NavView, payload?: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [activeBeforeAfterIndex, setActiveBeforeAfterIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>('agency_owner');

  const activeItem = BEFORE_AFTER_ITEMS[activeBeforeAfterIndex] || BEFORE_AFTER_ITEMS[0];
  const selectedAudience = AUDIENCE_PROFILES.find((a) => a.id === selectedAudienceId) || AUDIENCE_PROFILES[0];

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(activeItem.improved.replace(/^"|"$/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section matching Reference Image 4 */}
      <section className="pt-8 sm:pt-12 lg:pt-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Communication Coach for Client-Facing Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#14362b] tracking-tight leading-[1.1] font-serif">
            Say it clearly. <br />
            <span className="text-[#245844]">Make it count.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            ClearCue helps BPO and Virtual Assistance professionals — especially in insurance operations — turn everyday workplace messages into clearer, more complete, and more client-friendly communication.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              id="hero-check-message-btn"
              onClick={() => onNavigate('check')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#14362b] hover:bg-[#0e271f] text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>Check a Message</span>
            </button>

            <button
              id="hero-draft-email-btn"
              onClick={() => onNavigate('draft-email')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
            >
              <PenLine className="w-4 h-4 text-emerald-200" />
              <span>Draft an Email</span>
            </button>

            <button
              id="hero-start-practicing-btn"
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 shadow-sm transition-all cursor-pointer text-sm sm:text-base"
            >
              <Target className="w-4 h-4 text-slate-500" />
              <span>Practice Scenarios</span>
            </button>
          </div>

          {/* Mr. Cuckoo Friendly Wise Mascot with Voice */}
          <div className="pt-4 flex justify-center">
            <MrCuckoo
              size="md"
              mood="coach"
              customTip="Greetings! I'm Professor Cuckoo, your wise scholarly coach. Remember our Golden Rules: 1. Put the outcome first, 2. Attach the reason ('so that...'), 3. State Action Taken & Ahead, 4. Say 'Could you please', 5. Never blame, and 6. Ban vague words!"
            />
          </div>
        </div>
      </section>

      {/* THE 6 GOLDEN COMMUNICATION RULES SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-[#fbfaf6] rounded-3xl border border-emerald-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Operational Discipline</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                The 6 Golden Rules of Insurance Communication
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl mt-1">
                Codified by founder Prateek Bhatt to eliminate back-and-forth, protect client trust, and prevent coverage delays.
              </p>
            </div>

            <button
              onClick={() => onNavigate('draft-email')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14362b] hover:bg-[#0e271f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start md:self-auto"
            >
              <PenLine className="w-3.5 h-3.5 text-emerald-200" />
              <span>Write Compliant Email</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Rule 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 1: Bottom Line Up Front
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  1
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Start with the Final Outcome / Request
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Put the final request or update immediately in sentence #1. Never bury it behind fluff.
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "The renewal is at risk."</p>
                <p>✓ "Could you please send the documents?"</p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 2: Operational Reason
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  2
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Attach Operational Reason ("so that...")
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Attach the operational reason where important (e.g. requests or priority checks). Need not be added in every scenario. (Impact is covered under Completeness).
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "...so that I can check the further details"</p>
                <p>✓ "...so that I can prioritize them accordingly"</p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 3: Dual-Phase Updates
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  3
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Include "Action Taken" & "Action Ahead"
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add where important for work updates to show what was done and what follows next (need not be forced into every quick exchange).
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "Action Taken: Contacted clients."</p>
                <p>✓ "Action Ahead: Follow up tomorrow by 10 AM."</p>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 4: Polite Requests
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  4
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Never Issue Orders or Commands
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commands like "Send me..." are banned. Frame inquiries with courtesy.
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "Could you please send the policy documents?"</p>
                <p>✓ "May I know which task to prioritize?"</p>
              </div>
            </div>

            {/* Rule 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 5: Zero Blame
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  5
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Neutral, Solution-Oriented Phrasing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never accuse ("You didn't submit"). Preserve partnerships through neutral facts.
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "Sir, as I see that there are documents missing, I would appreciate your support..."</p>
              </div>
            </div>

            {/* Rule 6 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Rule 6: Ban Vague Quantifiers
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  6
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Concrete Numbers & Cutoff Timestamps
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eliminate "some", "many", "a few", and "asap". State exact counts and deadlines.
              </p>
              <div className="p-3 bg-[#fbfaf6] rounded-xl border border-slate-200 text-xs font-mono text-emerald-900 space-y-1">
                <p>✓ "2 endorsement forms"</p>
                <p>✓ "Policy #GL-1049 by 3:00 PM EST today"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE -> AFTER Showcase matching Reference Image 4 */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <span>BEFORE → AFTER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Real Workplace Communication Transformation
              </h2>
            </div>

            {/* Scenario switcher pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {BEFORE_AFTER_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  id={`before-after-tab-${item.id}`}
                  onClick={() => setActiveBeforeAfterIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeBeforeAfterIndex === idx
                      ? 'bg-[#14362b] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Original Card */}
            <div className="bg-[#fcfaf7] rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Original
                  </span>
                  <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Needs Specificity
                  </span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-sm sm:text-base text-slate-800 leading-relaxed min-h-[90px] flex items-center">
                  "{activeItem.original}"
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-slate-700">Audience:</span>
                <span>{activeItem.audience}</span>
              </div>
            </div>

            {/* Improved Card */}
            <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-200 flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Improved
                  </span>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{activeItem.highlightC} +{activeItem.scoreGain}</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-200 text-sm sm:text-base text-slate-900 font-medium leading-relaxed min-h-[90px] flex items-center shadow-xs">
                  "{activeItem.improved}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs font-semibold text-emerald-800">
                  ✓ {activeItem.gainLabel}
                </p>
                <button
                  onClick={handleCopyImproved}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                  title="Copy improved message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Explanation note */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              💡
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-slate-900">Why this matters: </span>
              <span>{activeItem.explanation}</span>
            </div>
          </div>

          {/* Quick CTA to try checking */}
          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('check')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <span>Test your own message against this rubric</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* The 7 Cs Pillar Grid */}
      <section className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            The 7 Cs of Client-Facing Communication
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            The proven international standard for high-stakes operational dialogue, customized for insurance brokers and virtual assistants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {SEVEN_CS_PRINCIPLES.map((principle) => (
            <div
              key={principle.key}
              onClick={() => onNavigate('seven-cs', { activeC: principle.key })}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {principle.name}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    +{principle.improvementDelta} pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {principle.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>View Insurance Rule</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Quick 7 Cs Callout Card */}
          <div
            onClick={() => onNavigate('seven-cs')}
            className="bg-[#14362b] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 cursor-pointer hover:bg-[#0e271f] transition-colors"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Framework</span>
              <h3 className="text-lg font-bold font-serif">Explore All 7 Cs & Checklists</h3>
              <p className="text-xs text-slate-300">
                Dive deep into bad vs. good examples, common VA pitfalls, and operational rubrics.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
              <span>Open Framework Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* NEW FEATURES SPOTLIGHT: Pronunciation & Flashcards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pronunciation Check Card */}
          <div 
            onClick={() => onNavigate('pronunciation')}
            className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                  Auditory Training
                </span>
                <span className="text-xl">🇺🇸 🇬🇧 🇨🇦</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Pronunciation & Accent Coach
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Test how your workplace sentences sound in US, UK, and Canadian English accents. Practice speaking with your microphone and get instant accuracy scores and mouth/tongue phonetic fixes.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <div className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-emerald-700" />
                <span>Try Pronunciation Check</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Vocabulary Flashcards & Memory Game Card */}
          <div 
            onClick={() => onNavigate('flashcards')}
            className="p-6 sm:p-8 bg-[#fbfaf6] rounded-3xl border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                  Interactive Practice
                </span>
                <span className="text-xl">🗂️ 🎮</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Insurance Vocabulary & Memory Game
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review essential insurance terms (endorsements, loss runs, binders, subrogation) with real workplace usage examples. After reviewing 5+ cards, test your recall in the shuffled Memory Match Game!
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-emerald-700" />
                <span>Open Flashcards & Game</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to make your communication clearer? CTA Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-[#14362b] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
            Ready to make your communication clearer?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Practice real insurance scenarios, audit your upcoming emails with Professor Cuckoo, and draft high-converting messages in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="cta-draft-email-bottom-btn"
              onClick={() => onNavigate('draft-email')}
              className="px-7 py-3 rounded-full bg-white text-[#14362b] font-bold hover:bg-slate-100 shadow-sm transition-all cursor-pointer text-sm"
            >
              Draft an Email
            </button>
            <button
              id="cta-start-practicing-bottom-btn"
              onClick={() => onNavigate('practice')}
              className="px-7 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-sm transition-all cursor-pointer text-sm"
            >
              Start Practicing
            </button>
          </div>
        </div>
      </section>

      {/* Prototype Disclaimer */}
      <footer className="max-w-4xl mx-auto px-4 text-center border-t border-slate-200 pt-8">
        <p className="text-xs text-slate-500 leading-relaxed">
          ClearCue — an interactive communication coaching platform. Founded by Prateek Bhatt. Calibrated for insurance brokers, agencies, and Virtual Assistants.
        </p>
      </footer>
    </div>
  );
};
