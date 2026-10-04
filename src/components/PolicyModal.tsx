import React, { useState } from 'react';
import { Shield, FileText, Lock, Cookie, X, ExternalLink, Check, Copy } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'security' | 'cookies';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${activeTab}.html`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">ClearCue Legal & Governance Center</h2>
              <p className="text-xs text-slate-400">Enterprise policies, data protections, and insurance compliance standards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Copy link to standalone policy page"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share Link'}
            </button>
            <a
              href={`/${activeTab}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition-colors"
              title="Open full page view"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Page</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/20 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Compliance</span>
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Cookie & Storage</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-slate-300">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-300 text-xs">
                <strong>Insurance Data Protection Guarantee:</strong> ClearCue does not sell or trade insurance operational data. Analysis prompts are evaluated in-memory and are never indexed into public machine learning corpora.
              </div>
              <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
              <p>We collect essential operational data necessary to deliver customized coaching metrics: account profile information (name, role, agency affiliation), authentication hashes, and practice telemetry (7 Cs score progression, scenario completion times, audio evaluation ratings).</p>
              
              <h3 className="text-base font-bold text-white">2. In-Memory NLP & Zero Third-Party Tracking</h3>
              <p>Everyday message checks use a locally compiled heuristic natural language scoring engine. When optional external AI services (Google Gemini API) are used, requests are transmitted over encrypted TLS channels and processed transiently without permanent storage.</p>
              
              <h3 className="text-base font-bold text-white">3. Data Retention & Deletion</h3>
              <p>Practice metrics stored in MongoDB Atlas remain accessible to your account until deleted. Agency administrators can request team data exports or complete account purges upon written notice.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                <strong>Educational Simulation Notice:</strong> ClearCue provides coaching guidance for insurance communications. It does not provide legal advice, licensed insurance underwriting authority, or binding coverage decisions.
              </div>
              <h3 className="text-base font-bold text-white">1. Authorized User Roles</h3>
              <p>ClearCue provides multi-tier Role-Based Access Control (RBAC). Trainees, Teachers, Admins, and Master supervisors are granted privileges strictly according to their assigned organizational capacity.</p>

              <h3 className="text-base font-bold text-white">2. Acceptable Use</h3>
              <p>Users must not upload malicious payloads, attempt credential stuffing, or inject unredacted Social Security Numbers or credit card PANs into mock simulation scenarios.</p>

              <h3 className="text-base font-bold text-white">3. Intellectual Property</h3>
              <p>The 7 Cs scoring matrices, phoneme analysis routines, voice simulation algorithms, and custom training curriculum are proprietary assets of ClearCue Technologies.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
                <strong>SOC2 & HIPAA Operational Alignment:</strong> Designed to uphold the strict confidentiality requirements of commercial insurance agencies, independent brokerages, and BPO service providers.
              </div>
              <h3 className="text-base font-bold text-white">1. End-to-End Cryptography</h3>
              <p>All traffic between GitHub Pages (frontend), Render (Node.js backend), and MongoDB Atlas (cloud database) is strictly enforced with TLS 1.3 encryption. Passwords are salted and hashed using bcrypt.</p>

              <h3 className="text-base font-bold text-white">2. Multi-Tier Governance & Audit Readiness</h3>
              <p>System activities, role promotions, and curriculum modifications are logged with tamper-evident audit markers to ensure compliance with internal agency standards.</p>

              <h3 className="text-base font-bold text-white">3. Automated Disaster Recovery</h3>
              <p>ClearCue maintains dual-engine persistence with automated failover safeguards, preventing data loss during network interruptions or maintenance windows.</p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs">
                <strong>Zero Ad-Trackers:</strong> ClearCue does not load advertising cookies, Google Analytics trackers, or cross-domain surveillance pixels.
              </div>
              <h3 className="text-base font-bold text-white">1. Essential Local Storage Only</h3>
              <p>We use HTML5 <code>localStorage</code> purely to remember your logged-in authentication token (<code>clearcue_auth_token</code>), your connected backend endpoint, and your offline-first practice history.</p>

              <h3 className="text-base font-bold text-white">2. Resetting Stored Data</h3>
              <p>You can revoke and clear all locally stored session tokens at any time by clicking <strong>Log Out</strong> or resetting your browser site data.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; 2026 ClearCue &bull; Verified Production Environment</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
