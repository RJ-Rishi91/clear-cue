import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { getSoftAnimatedCuckooVoice } from '../utils/voiceUtils';

export type CuckooMood = 'idle' | 'coach' | 'celebrating' | 'thinking' | 'talking';

interface MrCuckooProps {
  mood?: CuckooMood;
  customTip?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  className?: string;
  onTipClick?: () => void;
  interactiveAudio?: boolean;
  variant?: 'card' | 'avatar' | string;
  title?: string;
  message?: string;
}

// Scholarly, wise, animated tips from Professor Cuckoo
const CUCKOO_COACHING_TIPS: string[] = [
  "Rule 1: Lead with the bottom line up front! State the final request or update immediately.",
  "Rule 2: Operational Reason — attach 'so that...' where important to explain the operational need.",
  "Rule 3: For status updates, include 'Action Taken' and 'Action Ahead' where relevant!",
  "Rule 4: Never order or command. Say 'Could you please...' or 'May I...'.",
  "Rule 5: Zero blaming language. Always keep the phrasing neutral and solution-focused.",
  "Rule 6: Ban vague quantifiers like 'some' or 'many'. Cite exact policy numbers and deadlines!",
  "Tip for Agency Owners: They are your primary business partners — be solutions-first and respect their time!",
  "Tip for End Clients: Speak plain English with warm reassurance — no insurance jargon!",
  "Tip for Carriers & Adjusters: Be precise, factual, and well-documented with explicit timestamps.",
];

export const MrCuckoo: React.FC<MrCuckooProps> = ({
  mood = 'coach',
  customTip,
  size = 'md',
  showSpeechBubble = true,
  className = '',
  onTipClick,
  interactiveAudio = true,
  variant,
  title,
  message,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }

    // Natural blinking loop
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const activeTip = message || customTip || CUCKOO_COACHING_TIPS[tipIndex];

  if (variant === 'card' || message) {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white rounded-3xl border border-emerald-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 ${className}`}>
        <div className="shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-center p-1">
            <span className="text-3xl" role="img" aria-label="Mr Cuckoo">🦉</span>
          </div>
        </div>
        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950 font-serif">
              {title || "Professor Cuckoo's Communication Coaching"}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            "{activeTip}"
          </p>
        </div>
      </div>
    );
  }

  // Play a gentle, scholarly animated musical chime (C5 -> E5 -> G5)
  const playWiseChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.32);
      });
    } catch {
      // Audio autoplay gracefully ignored
    }
  };

  // Speak with animated, lively, scholarly warmth
  const speakTip = (text: string) => {
    if (!speechSupported || isMuted) return;

    window.speechSynthesis.cancel();
    playWiseChime();

    const utterance = new SpeechSynthesisUtterance(text);
    // Softer animated AI voice (gentle pitch, warm friendly cadence)
    utterance.pitch = 1.20;
    utterance.rate = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const softAnimatedVoice = getSoftAnimatedCuckooVoice(voices);

    if (softAnimatedVoice) {
      utterance.voice = softAnimatedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCuckooClick = () => {
    if (onTipClick) {
      onTipClick();
    } else {
      setTipIndex((prev) => (prev + 1) % CUCKOO_COACHING_TIPS.length);
    }
    if (interactiveAudio) {
      speakTip(activeTip);
    }
  };

  // Dimensional scale helpers
  const sizeClasses = {
    sm: 'w-12 h-14',
    md: 'w-20 h-24',
    lg: 'w-28 h-32',
    hero: 'w-36 h-40 sm:w-44 sm:h-48',
  }[size];

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Animated Wise Owl/Cuckoo Character inspired by Reference Image */}
      <div
        id="mr-cuckoo-character"
        onClick={handleCuckooClick}
        className={`relative ${sizeClasses} cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95`}
        title="Click Mr. Cuckoo to hear coaching tips!"
      >
        {/* Soft shadow under feet */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-slate-900/15 rounded-full blur-xs" />

        {/* Wise Scholarly Feathered Mascot SVG */}
        <svg
          viewBox="0 0 200 230"
          className={`w-full h-full drop-shadow-md transition-all ${
            isSpeaking ? 'animate-bounce' : 'animate-pulse'
          }`}
          style={{ animationDuration: isSpeaking ? '0.7s' : '4s' }}
        >
          <defs>
            {/* Feathery Body Gradient */}
            <linearGradient id="greyFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b2b9c3" />
              <stop offset="50%" stopColor="#8d97a5" />
              <stop offset="100%" stopColor="#677382" />
            </linearGradient>

            {/* Orange Crest & Belly Gradient */}
            <linearGradient id="warmOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffab3d" />
              <stop offset="50%" stopColor="#f58e1b" />
              <stop offset="100%" stopColor="#d96c09" />
            </linearGradient>

            {/* Glossy Spectacle Rim */}
            <linearGradient id="glassesRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3038" />
              <stop offset="50%" stopColor="#1a1c22" />
              <stop offset="100%" stopColor="#0d0e12" />
            </linearGradient>

            {/* Lens Glare */}
            <linearGradient id="lensGlare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Beak Gradient */}
            <linearGradient id="beakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb833" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* 1. FEATHERY ORANGE CREST (Tuft on top of head) */}
          <g id="crest-tufts">
            {/* Left smaller tuft */}
            <path
              d="M 90 45 C 80 25, 82 8, 92 2 C 95 18, 98 28, 96 45 Z"
              fill="url(#warmOrangeGrad)"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Center tall dominant tuft */}
            <path
              d="M 98 42 C 96 15, 102 -2, 108 -1 C 112 16, 110 26, 104 42 Z"
              fill="url(#warmOrangeGrad)"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Right tuft */}
            <path
              d="M 104 46 C 110 26, 116 12, 122 10 C 118 25, 114 34, 108 46 Z"
              fill="url(#warmOrangeGrad)"
              stroke="#b45309"
              strokeWidth="1.5"
            />
          </g>

          {/* 2. MAIN FLUFFY GREY BODY WITH LAYERED FEATHERS */}
          <g id="body-main">
            {/* Outer body silhouette with feathery tufts at sides */}
            <path
              d="M 100 35 
                 C 135 35, 160 60, 165 95 
                 C 172 105, 178 120, 168 135 
                 C 176 148, 170 165, 158 175 
                 C 142 192, 125 198, 100 198 
                 C 75 198, 58 192, 42 175 
                 C 30 165, 24 148, 32 135 
                 C 22 120, 28 105, 35 95 
                 C 40 60, 65 35, 100 35 Z"
              fill="url(#greyFeatherGrad)"
              stroke="#4b5563"
              strokeWidth="2.5"
            />

            {/* Feathery zig-zag side textures */}
            <path
              d="M 33 130 L 45 136 L 31 146 L 46 152 L 35 162 L 52 168"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 167 130 L 155 136 L 169 146 L 154 152 L 165 162 L 148 168"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 3. WARM ORANGE ROUND BELLY */}
          <ellipse
            cx="100"
            cy="146"
            rx="46"
            ry="42"
            fill="url(#warmOrangeGrad)"
            stroke="#b45309"
            strokeWidth="2"
          />

          {/* Inner belly feather warmth accent */}
          <ellipse
            cx="100"
            cy="142"
            rx="36"
            ry="32"
            fill="#f59e0b"
            opacity="0.2"
          />

          {/* 4. SCHOLARLY GLASSES & WISE EYES (Inspired by uploaded reference) */}
          <g id="scholarly-glasses-and-eyes">
            {/* Left Eye Sclera & Iris */}
            <circle cx="68" cy="98" r="25" fill="#fef3c7" stroke="#334155" strokeWidth="1" />
            <circle cx="70" cy="98" r="16" fill="#d97706" />
            <circle cx="70" cy="98" r="11" fill="#1e1b18" />
            {/* Eye Specular Highlights */}
            <circle cx="66" cy="94" r="4.5" fill="#ffffff" />
            <circle cx="74" cy="102" r="2" fill="#ffffff" />

            {/* Right Eye Sclera & Iris */}
            <circle cx="132" cy="98" r="25" fill="#fef3c7" stroke="#334155" strokeWidth="1" />
            <circle cx="130" cy="98" r="16" fill="#d97706" />
            <circle cx="130" cy="98" r="11" fill="#1e1b18" />
            {/* Eye Specular Highlights */}
            <circle cx="126" cy="94" r="4.5" fill="#ffffff" />
            <circle cx="134" cy="102" r="2" fill="#ffffff" />

            {/* Blinking Eyelids */}
            {isBlinking && (
              <>
                <ellipse cx="68" cy="98" rx="25" ry="25" fill="#8d97a5" />
                <path d="M 43 98 Q 68 106 93 98" stroke="#334155" strokeWidth="3" fill="none" />
                <ellipse cx="132" cy="98" rx="25" ry="25" fill="#8d97a5" />
                <path d="M 107 98 Q 132 106 157 98" stroke="#334155" strokeWidth="3" fill="none" />
              </>
            )}

            {/* ICONIC THICK BLACK ROUND GLASSES FRAMES */}
            {/* Left Frame */}
            <circle
              cx="68"
              cy="98"
              r="27"
              fill="none"
              stroke="url(#glassesRimGrad)"
              strokeWidth="7"
            />
            {/* Left Lens Glare */}
            <path
              d="M 52 82 C 60 76, 76 76, 84 84 L 76 96 C 70 90, 60 90, 56 94 Z"
              fill="url(#lensGlare)"
            />

            {/* Right Frame */}
            <circle
              cx="132"
              cy="98"
              r="27"
              fill="none"
              stroke="url(#glassesRimGrad)"
              strokeWidth="7"
            />
            {/* Right Lens Glare */}
            <path
              d="M 116 82 C 124 76, 140 76, 148 84 L 140 96 C 134 90, 124 90, 120 94 Z"
              fill="url(#lensGlare)"
            />

            {/* Glasses Bridge between the two rims */}
            <path
              d="M 95 96 Q 100 90 105 96"
              fill="none"
              stroke="url(#glassesRimGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />

            {/* Glasses Side Temples */}
            <path d="M 41 94 L 28 90" stroke="url(#glassesRimGrad)" strokeWidth="5" strokeLinecap="round" />
            <path d="M 159 94 L 172 90" stroke="url(#glassesRimGrad)" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* 5. POINTED GOLDEN-ORANGE BEAK (Nestled neatly below bridge) */}
          <g id="beak">
            <path
              d={
                isSpeaking
                  ? 'M 93 104 L 107 104 L 100 134 Z' // Talking open beak
                  : 'M 93 105 L 107 105 L 100 128 Z' // Resting wise beak
              }
              fill="url(#beakGrad)"
              stroke="#b45309"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Beak centerline highlight */}
            <line x1="100" y1="105" x2="100" y2="124" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* 6. ORANGE CLAWS / FEET */}
          <g id="feet">
            {/* Left Foot */}
            <path
              d="M 72 195 C 68 205, 58 212, 60 216 C 66 215, 72 208, 75 200 C 78 208, 84 216, 90 214 C 88 208, 82 202, 78 195 Z"
              fill="#ea580c"
              stroke="#9a3412"
              strokeWidth="1.5"
            />
            {/* Right Foot */}
            <path
              d="M 122 195 C 118 205, 110 214, 112 216 C 118 214, 124 208, 126 200 C 130 208, 136 216, 142 214 C 140 208, 134 202, 128 195 Z"
              fill="#ea580c"
              stroke="#9a3412"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Audio Speaking Wave Badge */}
        {isSpeaking && (
          <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full shadow-md animate-bounce">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Mascot Name Pill on Hover */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm pointer-events-none">
          Professor Cuckoo
        </div>
      </div>

      {/* Speech Bubble with Animated Tip */}
      {showSpeechBubble && (
        <div
          id="cuckoo-speech-bubble"
          onClick={handleCuckooClick}
          className="relative max-w-xs sm:max-w-sm bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Bubble Pointer Arrow pointing to Mr. Cuckoo */}
          <div className="absolute top-5 -left-2 w-4 h-4 bg-white border-l border-b border-slate-200/90 transform rotate-45" />

          <div className="relative space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Professor Cuckoo</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  Wise Coach
                </span>
              </div>

              {speechSupported && interactiveAudio && (
                <button
                  id="cuckoo-voice-toggle-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    } else {
                      speakTip(activeTip);
                    }
                  }}
                  className="text-slate-400 hover:text-emerald-700 p-1 rounded-md transition-colors cursor-pointer"
                  title={isSpeaking ? 'Stop speaking' : 'Listen with Mr. Cuckoo voice'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900 font-medium">
              "{activeTip}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Click to cycle tips & hear voice</span>
              <span className="font-semibold text-emerald-700 group-hover:underline">Next tip →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
