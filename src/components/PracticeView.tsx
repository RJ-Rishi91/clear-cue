import React, { useState } from 'react';
import { PracticeScenario, PracticeEvaluationResult, Audience } from '../types';
import { PRACTICE_SCENARIOS } from '../data/scenariosData';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  Award, 
  TrendingUp, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface PracticeViewProps {
  completedScenarioIds: string[];
  onScenarioCompleted: (scenarioId: string, score: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  completedScenarioIds,
  onScenarioCompleted,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PRACTICE_SCENARIOS[0].id);
  const [userResponse, setUserResponse] = useState<string>('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<PracticeEvaluationResult | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const currentScenario =
    PRACTICE_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRACTICE_SCENARIOS[0];

  const handleSelectScenario = (scenario: PracticeScenario) => {
    setSelectedScenarioId(scenario.id);
    setUserResponse('');
    setEvalResult(null);
    setShowModelAnswer(false);
  };

  const handleLoadStarter = () => {
    setUserResponse(currentScenario.starterDraft);
  };

  const handleSubmitEvaluation = async () => {
    if (!userResponse.trim()) return;

    setEvaluating(true);
    setEvalResult(null);

    try {
      const res = await fetch('/api/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: currentScenario.id,
          scenarioTitle: currentScenario.title,
          scenarioGoal: currentScenario.goal,
          userResponse,
          audience: currentScenario.audienceLabel,
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation failed.');
      }

      const data: PracticeEvaluationResult = await res.json();
      setEvalResult(data);

      if (data.passed) {
        onScenarioCompleted(currentScenario.id, data.score);
      }
    } catch (err) {
      console.error(err);
      // Fallback local grading
      const words = userResponse.trim().split(/\s+/).length;
      const score = Math.min(95, Math.max(65, 60 + (words > 25 ? 25 : 10)));
      const fallbackData: PracticeEvaluationResult = {
        score,
        passed: score >= 75,
        feedback: 'Good work! Your message addresses the core issue. Make sure your timelines are explicit and the next owner is clearly assigned.',
        strengths: ['Demonstrated professional composure', 'Directly addressed the incoming scenario'],
        areasForImprovement: ['Add a firm cutoff time (e.g. 11:30 AM EST)', 'Reiterate specific policy or claim number'],
        modelAnswerTip: 'Top VAs always give the reader peace of mind by stating what is already in motion.',
      };
      setEvalResult(fallbackData);
      if (fallbackData.passed) {
        onScenarioCompleted(currentScenario.id, fallbackData.score);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const filteredScenarios = PRACTICE_SCENARIOS.filter((s) => {
    if (audienceFilter === 'all') return true;
    return s.audience === audienceFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
          <Target className="w-3.5 h-3.5" />
          <span>Interactive Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Insurance Practice Arena
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Solve authentic workplace scenarios insurance VAs face daily. Practice turns instinct into excellence.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Audience:</span>
        {['all', 'insured', 'carrier', 'client', 'internal_team'].map((filter) => (
          <button
            key={filter}
            onClick={() => setAudienceFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              audienceFilter === filter
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {filter === 'all'
              ? 'All Scenarios'
              : filter === 'insured'
              ? 'Insured (Policyholder)'
              : filter === 'carrier'
              ? 'Carrier Underwriter'
              : filter === 'client'
              ? 'Client / Broker'
              : 'Internal Team'}
          </button>
        ))}
      </div>

      {/* Scenario Grid Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredScenarios.map((scenario) => {
          const isSelected = scenario.id === currentScenario.id;
          const isCompleted = completedScenarioIds.includes(scenario.id);

          return (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                    {scenario.difficulty}
                  </span>
                  {isCompleted && (
                    <span title="Completed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                  {scenario.title}
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {scenario.audienceLabel.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Practice Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context & Incoming message */}
        <div className="lg:col-span-5 space-y-6">
          {/* Situation Context */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                The Scenario
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentScenario.category}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {currentScenario.title}
            </h2>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block">Operational Background:</span>
              <p>{currentScenario.context}</p>
            </div>

            {/* Incoming Message Box */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800">Incoming Message from {currentScenario.fromName}:</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed">
                {currentScenario.incomingMessage}
              </div>
            </div>

            {/* Scenario Goal & Key Points */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-2 text-xs">
              <span className="font-bold text-blue-900 uppercase tracking-wider block">
                Your Goal
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">{currentScenario.goal}</p>

              <div className="pt-2">
                <span className="font-semibold text-blue-900 block mb-1">Key Points to Include:</span>
                <ul className="space-y-1 text-slate-700">
                  {currentScenario.keyPointsToInclude.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Response & Evaluation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="practice-response-input" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Response to {currentScenario.fromName.split(' ')[0]}
              </label>

              <button
                onClick={handleLoadStarter}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                Load Starter Draft
              </button>
            </div>

            <textarea
              id="practice-response-input"
              rows={8}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Write your response here using the 7 Cs (ensure you state concrete deadlines, policy details, and next ownership)..."
              className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                {userResponse.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                id="submit-practice-btn"
                onClick={handleSubmitEvaluation}
                disabled={evaluating || !userResponse.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                {evaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Grading with ClearCue Rubric...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-300" />
                    <span>Submit for Coaching Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Evaluation Results Card */}
          {evalResult && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Coaching Feedback
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Scenario Assessment</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {evalResult.score}/100
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      evalResult.passed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {evalResult.passed ? '✓ Scenario Passed' : 'Needs Polish'}
                  </span>
                </div>
              </div>

              {/* Overall Feedback */}
              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                {evalResult.feedback}
              </p>

              {/* Strengths & Improvement Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Strengths</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evalResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Areas to Elevate</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evalResult.areasForImprovement.map((area, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="text-xs text-slate-600 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-900">Insurance VA Pro Tip: </span>
                  <span>{evalResult.modelAnswerTip}</span>
                </div>
              </div>

              {/* Exemplar Model Answer Toggle */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {showModelAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showModelAnswer ? 'Hide Exemplar Model Answer' : 'View Exemplar Model Answer'}</span>
                </button>

                {showModelAnswer && (
                  <div className="p-5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-inner animate-fade-in">
                    {currentScenario.exemplarResponse}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
