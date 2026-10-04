import React from 'react';
import { NavView } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  Users, 
  Target, 
  ArrowRight, 
  AlertTriangle,
  ExternalLink,
  Linkedin,
  Building2,
  Briefcase,
  PenTool,
  Headphones,
  Gamepad2,
  Clock,
  Layers,
  HeartHandshake,
  GraduationCap,
  Award,
  PhoneCall,
  BarChart3
} from 'lucide-react';
import { MrCuckoo } from './MrCuckoo';

interface AboutViewProps {
  onNavigate: (view: NavView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 pt-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800">
          A BIT
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif">
          ABOUT US
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed pt-1">
          Bridging the gap between training and business performance for insurance professionals and Virtual Assistants.
        </p>
      </div>

      {/* SECTION 1: FOUNDER PRATEEK BHATT */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Photo & LinkedIn ID */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-52 sm:w-60">
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 aspect-square">
                <img
                  src="/prateek-bhatt.jpeg"
                  alt="Prateek Bhatt - Founder of ClearCue"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/1767335959758.jpg') {
                      target.src = '/1767335959758.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] font-semibold text-emerald-300">Founder & L&D Specialist</p>
                  <h3 className="text-lg font-bold leading-tight">Prateek Bhatt</h3>
                </div>
              </div>

              {/* Verified badge */}
              <div className="absolute -top-2 -right-2 bg-emerald-700 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* LinkedIn ID & Connect Button */}
            <div className="mt-5 text-center w-full space-y-2">
              <a
                id="founder-linkedin-link"
                href="https://www.linkedin.com/in/prateek-bhatt-1979121ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Linkedin className="w-4 h-4 fill-current" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
              <p className="text-[11px] text-slate-500 font-mono break-all">
                ID: https://www.linkedin.com/in/prateek-bhatt-1979121ba/
              </p>
            </div>
          </div>

          {/* A Bit About Me - 3rd Person Perspective */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Founder: Prateek Bhatt</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              A Bit About Prateek
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Prateek Bhatt</strong> is a Learning & Development specialist who helps organizations build confident, workplace-ready professionals by transforming how people communicate, learn, and perform.
              </p>
              <p>
                With <strong>4.5+ years of experience in L&D across the BPO and education sectors</strong>, he specializes in designing and delivering communication capability programs that bridge the gap between training and business performance.
              </p>
              <p>
                His expertise spans <strong>Training Needs Analysis (TNA), curriculum design, learning assessments, Voice & Accent, Business Communication, and performance coaching.</strong>
              </p>
              
              {/* Highlight Achievements */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 mt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Key Career Milestones:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>1,000+ professionals trained</strong> and <strong>5,000+ hours</strong> of instructor-led learning delivered.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Designed learning modules, assessment frameworks, communication rubrics, and certification standards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Led communication capability initiatives for new hires, partnering with business stakeholders to elevate workforce readiness.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Presented learning analytics and training insights to senior leadership to drive data-backed decisions.</span>
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-600 italic">
                Prateek focuses on solving real-world learning challenges, simplifying complex concepts, and building structured experiences that create measurable operational impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WHY TO USE US */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            ClearCue Value
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Why to Use Us
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1">
            Why insurance brokers, agencies, and Virtual Assistants rely on ClearCue rather than standard grammar checkers:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reason 1 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>1. Insurance & Operational Domain Focus</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard tools only check spelling. ClearCue audits whether critical operational elements—like policy numbers, exact cut-off timestamps, and SLA turnaround expectations—are clearly stated.
            </p>
          </div>

          {/* Reason 2 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>2. The 6 Golden Rules & 7 Cs Framework</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforces polite requests (<em>"Could you please..."</em>), zero-blame formulations, reasons attached (<em>"so that..."</em>), dual-phase updates (<em>Action Taken & Action Ahead</em>), and the complete elimination of vague quantifiers.
            </p>
          </div>

          {/* Reason 3 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>3. AI Mock Calls with Configurable Persona</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate realistic client, carrier underwriter, insured, and POC phone conversations. Practice with varying tones (polite, normal, rude/difficult) across US, UK, and Canadian accents with instant 7 Cs rubrics.
            </p>
          </div>

          {/* Reason 4 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Headphones className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>4. Multi-Accent Pronunciation Laboratory</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Check how any sentence sounds in US, UK, and Canadian accents. Patient voice recognition analyzes word accuracy, phonemes, syllable stress, and physical mouth/tongue drills.
            </p>
          </div>

          {/* Reason 5 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Gamepad2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>5. Categorized Vocabulary & Memory Games</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master 14 functional categories from insurance jargon to common corporate acronyms (SLA, TAT, EOD, COB) with audio pronunciation and interactive memory matching.
            </p>
          </div>

          {/* Reason 6 */}
          <div className="p-5 bg-[#fbfaf6] rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>6. Comprehensive User Dashboard & Report</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track progression, pinpoint exact Areas of Strength (AOS) and Areas for Improvement (AOI), and download an official formatted performance report for team leads.
            </p>
          </div>
        </div>

        {/* CTA to get started */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Ready to experience ClearCue communication intelligence?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('mock-calls')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Try AI Mock Calls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('check')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <span>Audit a Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mr. Cuckoo note */}
      <MrCuckoo
        variant="card"
        title="Mr. Cuckoo's Founder Perspective"
        message="Prateek built ClearCue so that every communication professional can bridge the gap between classroom English and business success. Politeness, precision, and operational clarity are the true competitive advantages in client retention."
      />
    </div>
  );
};
