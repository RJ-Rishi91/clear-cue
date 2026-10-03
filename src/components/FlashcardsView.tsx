import React, { useState, useEffect, useMemo } from 'react';
import { FlashcardItem, MemoryGameCard, FlashcardCategory } from '../types';
import { FLASHCARD_ITEMS, FLASHCARD_CATEGORIES } from '../data/flashcardsData';
import { MrCuckoo } from './MrCuckoo';
import { getSoftAnimatedCuckooVoice } from '../utils/voiceUtils';
import { 
  Sparkles, 
  RotateCw, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Shuffle, 
  Trophy, 
  Timer, 
  Gamepad2, 
  Layers, 
  BookOpen, 
  Check, 
  RefreshCw,
  FileText,
  TrendingDown,
  DollarSign,
  Scale,
  ShieldCheck,
  UserPlus,
  Clock,
  Hourglass,
  ShieldAlert,
  Search,
  AlertTriangle,
  Landmark,
  ArrowRightLeft,
  Package,
  Ban,
  Shield,
  Headphones,
  Briefcase,
  Users,
  Cpu,
  Calendar,
  HeartHandshake,
  ListOrdered,
  HelpCircle,
  Globe,
  Coffee,
  FileCheck2,
  Filter
} from 'lucide-react';

interface FlashcardsViewProps {
  onNavigateToPractice?: () => void;
}

// Icon mapper for dynamic terms
const renderTermIcon = (name: string, className = "w-6 h-6") => {
  switch (name) {
    case 'FileText': return <FileText className={className} />;
    case 'TrendingDown': return <TrendingDown className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'UserPlus': return <UserPlus className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Hourglass': return <Hourglass className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Search': return <Search className={className} />;
    case 'AlertTriangle': return <AlertTriangle className={className} />;
    case 'Landmark': return <Landmark className={className} />;
    case 'ArrowRightLeft': return <ArrowRightLeft className={className} />;
    case 'Package': return <Package className={className} />;
    case 'Ban': return <Ban className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'ListOrdered': return <ListOrdered className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'FileCheck2': return <FileCheck2 className={className} />;
    default: return <BookOpen className={className} />;
  }
};

export const FlashcardsView: React.FC<FlashcardsViewProps> = () => {
  const [activeTab, setActiveTab] = useState<'study' | 'memory'>('study');
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory>('all');
  
  // Flashcard Study State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return FLASHCARD_ITEMS;
    return FLASHCARD_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Memory Game State
  const [gameCategory, setGameCategory] = useState<FlashcardCategory>('all');
  const [gameCards, setGameCards] = useState<MemoryGameCard[]>([]);
  const [flippedCardIndices, setFlippedCardIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameSeconds, setGameSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Safe current item
  const currentItem = filteredItems[currentIndex] || filteredItems[0] || FLASHCARD_ITEMS[0];
  const reviewedCount = reviewedIds.size;
  const isReviewed = reviewedIds.has(currentItem?.id);

  // Reset index when category changes
  const handleCategoryChange = (cat: FlashcardCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Timer for memory game
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !gameWon) {
      interval = setInterval(() => {
        setGameSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameWon]);

  // Audio pronunciation helper using softer animated AI voice
  const handlePronounce = (term: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.rate = 0.95;
    utterance.pitch = 1.18;

    const voices = window.speechSynthesis.getVoices();
    const softVoice = getSoftAnimatedCuckooVoice(voices);
    if (softVoice) {
      utterance.voice = softVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Toggle mark reviewed
  const handleToggleReviewed = (id: string) => {
    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  // Keyboard navigation for flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'study') return;
      if (e.key === 'ArrowRight') handleNextCard();
      if (e.key === 'ArrowLeft') handlePrevCard();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, filteredItems.length]);

  // Initialize Memory Game with 6 pairs from chosen category
  const startMemoryGame = (categoryToPlay: FlashcardCategory = selectedCategory) => {
    setGameCategory(categoryToPlay);
    const pool = categoryToPlay === 'all' 
      ? FLASHCARD_ITEMS 
      : FLASHCARD_ITEMS.filter(item => item.category === categoryToPlay);

    // Pick 6 items (or as many as available)
    const shuffledItems = [...pool].sort(() => 0.5 - Math.random()).slice(0, Math.min(6, pool.length));
    
    const deck: MemoryGameCard[] = [];
    shuffledItems.forEach((item) => {
      // Card 1: The Word / Term Card (with icon & word)
      deck.push({
        id: `term-${item.id}`,
        pairId: item.id,
        type: 'term',
        content: item.term,
        subContent: item.collocation || item.phonetic,
        iconName: item.iconName,
        category: item.category,
        isFlipped: false,
        isMatched: false,
      });

      // Card 2: The Meaning / Definition Card (with icon & definition)
      deck.push({
        id: `meaning-${item.id}`,
        pairId: item.id,
        type: 'meaning',
        content: item.meaning,
        subContent: item.categoryLabel || 'Key Workplace Concept',
        iconName: item.iconName,
        category: item.category,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the combined deck
    const shuffledDeck = deck.sort(() => 0.5 - Math.random());
    setGameCards(shuffledDeck);
    setFlippedCardIndices([]);
    setMatchedPairIds(new Set());
    setMoves(0);
    setGameWon(false);
    setGameSeconds(0);
    setIsTimerRunning(true);
    setActiveTab('memory');
  };

  // Handle card click in memory game
  const handleCardClick = (index: number) => {
    if (flippedCardIndices.length === 2 || gameCards[index].isFlipped || gameCards[index].isMatched) {
      return;
    }

    const newFlipped = [...flippedCardIndices, index];
    const updatedCards = [...gameCards];
    updatedCards[index].isFlipped = true;
    setGameCards(updatedCards);
    setFlippedCardIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [idx1, idx2] = newFlipped;
      const card1 = updatedCards[idx1];
      const card2 = updatedCards[idx2];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...updatedCards];
          matchedCards[idx1].isMatched = true;
          matchedCards[idx2].isMatched = true;
          setGameCards(matchedCards);
          setFlippedCardIndices([]);

          setMatchedPairIds((prev) => {
            const next = new Set(prev).add(card1.pairId);
            if (next.size === (gameCards.length / 2)) {
              setGameWon(true);
              setIsTimerRunning(false);
            }
            return next;
          });
        }, 500);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          const resetCards = [...updatedCards];
          resetCards[idx1].isFlipped = false;
          resetCards[idx2].isFlipped = false;
          setGameCards(resetCards);
          setFlippedCardIndices([]);
        }, 1100);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Vocab Sheet & 14 Functional Categories
            </span>
            <span className="text-xs text-slate-500 font-medium">Interactive Learning</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Workplace Vocabulary & Memory Game
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Master high-frequency functional vocabulary, collocations, insurance terminology, and corporate idioms with interactive flashcards and memory matching.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'study'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Study Mode
          </button>
          <button
            onClick={() => {
              if (gameCards.length === 0) startMemoryGame(selectedCategory);
              else setActiveTab('memory');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'memory'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Memory Game
          </button>
        </div>
      </div>

      {/* Category Selection Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            Select Vocabulary Category ({FLASHCARD_CATEGORIES.length - 1} Specializations)
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> terms
          </span>
        </div>

        {/* Category Pills with horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {FLASHCARD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {renderTermIcon(cat.iconName, "w-3.5 h-3.5")}
                <span>{cat.shortLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-600 text-emerald-100' : 'bg-slate-200 text-slate-600'}`}>
                  {cat.id === 'all' ? FLASHCARD_ITEMS.length : FLASHCARD_ITEMS.filter(i => i.category === cat.id).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: STUDY FLASHCARDS */}
      {activeTab === 'study' && currentItem && (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                Card {currentIndex + 1} of {filteredItems.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                {currentItem.categoryLabel || currentItem.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Reviewed: <strong className="text-emerald-700">{reviewedCount}</strong> total</span>
            </div>
          </div>

          {/* Interactive Study Card */}
          <div 
            className="select-none min-h-[420px] w-full"
          >
            {!isFlipped ? (
              /* FRONT: Word, Phonetic, Collocation, Icon */
              <div 
                onClick={() => setIsFlipped(true)}
                className={`bg-white border-2 border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition-all min-h-[420px] cursor-pointer ${isReviewed ? 'ring-2 ring-emerald-500/20' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {renderTermIcon(currentItem.iconName, "w-4 h-4")}
                    {currentItem.categoryLabel || currentItem.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(currentItem.term);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleReviewed(currentItem.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        isReviewed 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600'
                      }`}
                      title={isReviewed ? "Marked as reviewed" : "Mark as reviewed"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Term Display */}
                <div className="text-center py-6 space-y-3 my-auto">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-700 mb-1">
                    {renderTermIcon(currentItem.iconName, "w-10 h-10")}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                    {currentItem.term}
                  </h2>
                  <p className="text-sm font-mono text-emerald-800 tracking-wider">
                    {currentItem.phonetic}
                  </p>
                  {currentItem.collocation && (
                    <div className="inline-block mt-2">
                      <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-medium">
                        Collocation: <strong className="font-semibold">{currentItem.collocation}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer Action: Reveal Meaning */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Reveal Meaning & Definition →</span>
                  </button>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                    Click anywhere or press Space to flip
                  </span>
                </div>
              </div>
            ) : (
              /* BACK: Explicit English Meaning, Usage Example, Context Tip */
              <div 
                onClick={() => setIsFlipped(false)}
                className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-slate-800 min-h-[420px] cursor-pointer"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Meaning & Definition
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {currentItem.categoryLabel || currentItem.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(currentItem.term);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Pronounce term"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleReviewed(currentItem.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        isReviewed 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-emerald-400'
                      }`}
                      title={isReviewed ? "Marked as reviewed" : "Mark as reviewed"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 my-auto py-3">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                      Term: {currentItem.term}
                    </span>
                    {/* Primary English Meaning Box */}
                    <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-4.5">
                      <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> English Meaning
                      </div>
                      <p className="text-base md:text-lg text-white font-medium leading-relaxed">
                        {currentItem.meaning}
                      </p>
                    </div>
                  </div>

                  {currentItem.collocation && (
                    <div className="text-xs text-amber-300 font-medium px-1 flex items-center gap-1.5">
                      <span className="font-bold text-amber-400">Standard Collocation:</span>
                      <span className="underline">{currentItem.collocation}</span>
                    </div>
                  )}

                  {/* Real Workplace Example */}
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
                    <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Real Workplace Example
                    </div>
                    <p className="text-sm text-slate-100 italic leading-snug">
                      "{currentItem.usage}"
                    </p>
                  </div>

                  {/* Context Tip */}
                  <div className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                    <span className="text-amber-400 font-bold shrink-0">Practical Tip:</span>
                    <span>{currentItem.contextTip}</span>
                  </div>
                </div>

                {/* Flip back button */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Flip Back to Word</span>
                  </button>
                  <span className="text-slate-500">Space or click anywhere to flip</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevCard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const randomIdx = Math.floor(Math.random() * filteredItems.length);
                  setIsFlipped(false);
                  setCurrentIndex(randomIdx);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Random Card"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Shuffle
              </button>
              <button
                onClick={() => startMemoryGame(selectedCategory)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                Play Memory Match with this Category
              </button>
            </div>

            <button
              onClick={handleNextCard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-sm"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: MEMORY MATCHING GAME */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          {/* Game Stats & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Gamepad2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Category: {FLASHCARD_CATEGORIES.find(c => c.id === gameCategory)?.shortLabel || 'All'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Match 6 Words with their exact Definitions ({gameCards.length} cards total)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <Timer className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatTime(gameSeconds)}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <span>Moves: <strong>{moves}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800">
                <span>Pairs: <strong>{matchedPairIds.size} / {gameCards.length / 2}</strong></span>
              </div>
              <button
                onClick={() => startMemoryGame(gameCategory)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                title="Restart game"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Game
              </button>
            </div>
          </div>

          {/* Quick Category Selector for Game */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Play category:</span>
            {FLASHCARD_CATEGORIES.map((catInfo) => {
              const isActive = gameCategory === catInfo.id;
              return (
                <button
                  key={catInfo.id}
                  onClick={() => startMemoryGame(catInfo.id)}
                  className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all border ${
                    isActive 
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {catInfo.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Memory Cards Grid (12 Cards - 4 cols on desktop, 3 on tablet, 2 on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gameCards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`relative min-h-[140px] md:min-h-[160px] rounded-2xl cursor-pointer select-none transition-all duration-300 transform perspective-1000 ${
                    card.isMatched 
                      ? 'opacity-85 ring-2 ring-emerald-500/60' 
                      : 'hover:scale-[1.02] shadow-sm'
                  }`}
                >
                  <div className={`w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
                    
                    {/* BACK OF CARD (Face Down) */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center border-2 border-slate-700 shadow-md">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 text-emerald-400 mb-2">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                        ClearCue
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Click to Flip</span>
                    </div>

                    {/* FRONT OF CARD (Face Up - Term or Meaning) */}
                    <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-4 flex flex-col justify-between border-2 transition-all ${
                      card.isMatched
                        ? 'bg-emerald-50/95 border-emerald-500 text-slate-900 shadow-sm'
                        : card.type === 'term'
                          ? 'bg-white border-emerald-200 text-slate-900 shadow-md'
                          : 'bg-slate-50 border-slate-300 text-slate-900 shadow-md'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          card.type === 'term' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {card.type === 'term' ? 'Term' : 'Definition'}
                        </span>
                        {renderTermIcon(card.iconName, "w-4 h-4 text-emerald-700")}
                      </div>

                      <div className="my-auto py-1 text-center">
                        <p className={`font-bold leading-snug ${
                          card.type === 'term' 
                            ? 'text-base md:text-lg text-slate-900' 
                            : 'text-xs md:text-sm text-slate-700 font-medium'
                        }`}>
                          {card.content}
                        </p>
                        {card.subContent && (
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">
                            {card.subContent}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5">
                        <span className="capitalize">{card.category.replace('_', ' ')}</span>
                        {card.isMatched && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Matched
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Victory Modal */}
          {gameWon && (
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-emerald-500/30 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 mb-1">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Fantastic Memory! All Pairs Matched!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                You successfully connected all functional vocabulary items in <strong>{formatTime(gameSeconds)}</strong> across <strong>{moves} moves</strong>.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => startMemoryGame(gameCategory)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-md"
                >
                  Play Another Round
                </button>
                <button
                  onClick={() => setActiveTab('study')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
                >
                  Back to Flashcards
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helpful Cuckoo Guide */}
      <MrCuckoo
        variant="card"
        title="Mr. Cuckoo's Functional Vocabulary Insight"
        message="Mastering these 14 categories ensures you never hesitate during client interactions or carrier calls. In insurance operations, using precise terms like 'binder', 'endorsement', and 'subrogation' prevents ambiguity and ensures immediate professional credibility."
      />
    </div>
  );
};
