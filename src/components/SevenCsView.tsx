import React, { useState } from 'react';
import { NavView, SevenCKey } from '../types';
import { SEVEN_CS_PRINCIPLES } from '../data/sevenCsData';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  ListChecks, 
  Send, 
  Check, 
  Copy 
} from 'lucide-react';

interface SevenCsViewProps {
  onNavigate: (view: NavView, payload?: any) => void;
  initialSelectedC?: SevenCKey;
}

export const SevenCsView: React.FC<SevenCsViewProps> = ({ onNavigate, initialSelectedC }) => {
  const [selectedKey, setSelectedKey] = useState<SevenCKey>(initialSelectedC || 'concrete');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activePrinciple = SEVEN_CS_PRINCIPLES.find((p) => p.key === selectedKey) || SEVEN_CS_PRINCIPLES[2];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/^"|"$/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestInChecker = (sampleText: string) => {
    onNavigate('check', { prefillMessage: sampleText.replace(/^"|"$/g, '') });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-6">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
          <span>Communication Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The 7 Cs of Insurance Communication
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          The international gold standard of business communication, contextualized specifically for back-office and virtual assistance workflows in property & casualty insurance.
        </p>
      </div>

      {/* 7 Cs Selector Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 px-2">
        {SEVEN_CS_PRINCIPLES.map((principle) => {
          const isSelected = selectedKey === principle.key;
          return (
            <button
              key={principle.key}
              id={`7c-tab-${principle.key}`}
              onClick={() => setSelectedKey(principle.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{principle.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                +{principle.improvementDelta}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Principle Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Title & Core Definition */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activePrinciple.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{activePrinciple.improvementDelta} Score Value</span>
              </span>
            </div>
            <p className="text-base text-slate-700 max-w-2xl">{activePrinciple.shortDesc}</p>
          </div>

          <button
            onClick={() => handleTestInChecker(activePrinciple.badExample)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm border border-blue-200 transition-colors cursor-pointer self-start md:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>Test a Message with this C</span>
          </button>
        </div>

        {/* Insurance Operational Impact & Pitfalls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Why it matters in Insurance */}
          <div className="bg-blue-50/40 p-6 rounded-xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Why Insurance Operations Cares</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {activePrinciple.insuranceImpact}
            </p>
          </div>

          {/* Common Pitfalls in VA messages */}
          <div className="bg-amber-50/40 p-6 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Common Everyday Pitfalls</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              {activePrinciple.commonPitfalls.map((pitfall, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real Workplace Comparison */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Workplace Comparison</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weak Example */}
            <div className="bg-rose-50/40 rounded-xl p-6 border border-rose-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Weak / Common Draft</span>
                  </span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Score: 48/100
                  </span>
                </div>

                <div className="p-4 bg-white rounded-lg border border-rose-200 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed min-h-[90px] flex items-center">
                  {activePrinciple.badExample}
                </div>
              </div>

              <div className="text-xs text-rose-900/80 bg-rose-100/60 p-3 rounded-lg">
                <span className="font-semibold">The Flaw:</span> {activePrinciple.badExplanation}
              </div>
            </div>

            {/* ClearCue Model Example */}
            <div className="bg-emerald-50/40 rounded-xl p-6 border border-emerald-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ClearCue Improved Version</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Score: 94/100
                  </span>
                </div>

                <div className="p-4 bg-white rounded-lg border border-emerald-200 text-xs sm:text-sm text-slate-900 font-medium leading-relaxed min-h-[90px] flex items-center shadow-xs">
                  {activePrinciple.goodExample}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-emerald-950 bg-emerald-100/70 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-semibold">The Gain:</span> {activePrinciple.goodExplanation}
                  </div>
                  <button
                    onClick={() => handleCopy(activePrinciple.goodExample, activePrinciple.key)}
                    className="shrink-0 ml-2 p-1 text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    title="Copy model response"
                  >
                    {copiedId === activePrinciple.key ? (
                      <Check className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VA Action Checklist */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ListChecks className="w-4 h-4 text-blue-600" />
            <span>Pre-Send Checklist for {activePrinciple.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activePrinciple.actionChecklist.map((item, i) => (
              <div
                key={i}
                className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                  {i + 1}
                </div>
                <span className="leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigate('check')}
          className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interactive Tool</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Analyze a Message with ClearCue
            </h3>
            <p className="text-xs text-slate-500 mt-1">Get instant scoring across all 7 Cs for your active email drafts.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => onNavigate('practice')}
          className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Practice Arena</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Solve Real Insurance Scenarios
            </h3>
            <p className="text-xs text-slate-500 mt-1">Test your ability to handle angry insureds and carrier follow-ups.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
