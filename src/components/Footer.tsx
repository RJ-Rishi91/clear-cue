import React from 'react';
import { Shield, Sparkles, Activity, FileText, Lock, Cookie, MapPin, ExternalLink } from 'lucide-react';
import { NavView } from '../types';
import { PolicyTab } from './PolicyModal';

interface FooterProps {
  onNavigate: (view: NavView) => void;
  onOpenPolicy: (tab: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-sm text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/20">
                CC
              </div>
              <span className="text-base font-bold text-white tracking-tight">ClearCue</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live &bull; v1.0
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs pr-4 max-w-sm">
              The AI-powered communication training platform built specifically for Insurance Virtual Assistants (VAs), broker account managers, and customer service representatives.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backend Service:</span>
              <a 
                href="https://clearcue-backend.onrender.com/api/status" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-1"
              >
                Render Cloud + MongoDB Atlas
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Coaching Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3.5 text-xs uppercase tracking-wider">Coaching Tools</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('check')} className="hover:text-sky-400 transition-colors text-left">
                  Check Message (7 Cs Scorer)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('draft-email')} className="hover:text-sky-400 transition-colors text-left">
                  Draft Insurance Email
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mock-calls')} className="hover:text-sky-400 transition-colors text-left">
                  AI Mock Call Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pronunciation')} className="hover:text-sky-400 transition-colors text-left">
                  Pronunciation Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('flashcards')} className="hover:text-sky-400 transition-colors text-left">
                  Terminology Flashcards
                </button>
              </li>
            </ul>
          </div>

          {/* Training & Standards */}
          <div>
            <h4 className="text-white font-semibold mb-3.5 text-xs uppercase tracking-wider">Curriculum</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('seven-cs')} className="hover:text-sky-400 transition-colors text-left">
                  7 Cs Framework
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-sky-400 transition-colors text-left">
                  Workplace Scenarios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('progress')} className="hover:text-sky-400 transition-colors text-left">
                  Agent Dashboard & Streaks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-sky-400 transition-colors text-left">
                  About ClearCue
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Governance & SEO */}
          <div>
            <h4 className="text-white font-semibold mb-3.5 text-xs uppercase tracking-wider">Policies & SEO</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-left">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-left">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('security')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-left">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span>Security & Compliance</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('cookies')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-left">
                  <Cookie className="w-3 h-3 text-slate-400" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-800">
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>Sitemap XML</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} ClearCue Technologies. Dedicated to precision communication in insurance operations.
          </p>
          <div className="flex items-center gap-4">
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
              Robots.txt
            </a>
            <span>&bull;</span>
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
              Static Privacy
            </a>
            <span>&bull;</span>
            <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
              Static Terms
            </a>
            <span>&bull;</span>
            <span className="text-slate-400">clear-cue.onerishi.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
