import React, { useState } from 'react';
import { MrCuckoo } from './MrCuckoo';
import { X, Send, Sparkles, HelpCircle, Loader2 } from 'lucide-react';

interface FloatingCuckooCoachProps {
  currentRuleTip?: string;
}

const QUICK_QUESTIONS = [
  'Review 6 Golden Rules',
  'How to de-escalate angry client?',
  'What is American Flap T?',
  'Explain Rule 2: "so that..."',
];

export const FloatingCuckooCoach: React.FC<FloatingCuckooCoachProps> = ({ currentRuleTip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [activeAdvice, setActiveAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [engineUsed, setEngineUsed] = useState<string>('Local AI Coach');

  const defaultTip =
    currentRuleTip ||
    "Greetings! I am Professor Cuckoo. Remember our 6 Golden Rules: 1. Put the outcome first. 2. Attach the reason ('so that...'). 3. Include Action Taken & Ahead. 4. Say 'Could you please' instead of ordering. 5. Never blame. 6. Ban vague words like 'some' or 'many' — be concrete!";

  const handleAsk = async (qText?: string) => {
    const q = (qText || questionInput).trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/cuckoo-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAdvice(data.answer);
        if (data.engine) setEngineUsed(data.engine);
      }
    } catch {
      setActiveAdvice("Remember our core principle: lead with the bottom-line outcome, attach 'so that...', and give an explicit timestamp like 'by 3:00 PM EST today'.");
    } finally {
      setIsLoading(false);
      setQuestionInput('');
    }
  };

  return (
    <aside aria-label="Professor Cuckoo Floating Voice Coach" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 animate-fade-in">
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-300 shadow-2xl p-5 max-w-sm sm:max-w-md w-[92vw] sm:w-[420px] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦉</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 font-serif">Professor Cuckoo</h3>
                  <p className="text-[10px] text-emerald-700 font-medium">{engineUsed} • Zero Paid Tool</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Professor Cuckoo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mascot & Speech */}
            <MrCuckoo
              size="md"
              mood="coach"
              customTip={activeAdvice || defaultTip}
            />

            {/* Quick Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-2.5 h-2.5" /> Quick Coach Topics:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(item)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors font-medium cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Trainee Question Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask Professor Cuckoo anything..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
              <button
                type="submit"
                disabled={isLoading || !questionInput.trim()}
                className="p-2 bg-[#14362b] hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
                title="Send Question"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="floating-cuckoo-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#14362b] hover:bg-[#0e271f] text-white shadow-lg shadow-emerald-950/20 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold text-xs sm:text-sm"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
        <span className="text-base leading-none">🦉</span>
        <span>{isOpen ? 'Close Coach' : 'Ask Professor Cuckoo'}</span>
      </button>
    </aside>
  );
};
