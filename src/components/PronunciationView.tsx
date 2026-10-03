import React, { useState, useEffect, useRef } from 'react';
import { AccentType, AccentProfile, PronunciationEvaluation, WordPronunciationFeedback, UserProfile } from '../types';
import { API_BASE, getAuthHeaders } from '../utils/api';
import { MrCuckoo } from './MrCuckoo';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Play, 
  RotateCw, 
  ExternalLink, 
  Youtube, 
  Award, 
  Info, 
  Check, 
  X, 
  ArrowRight,
  HelpCircle,
  Square,
  Clock,
  Radio
} from 'lucide-react';

const ACCENT_PROFILES: Record<AccentType, AccentProfile> = {
  us: {
    id: 'us',
    name: 'General American (US)',
    country: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    summary: 'Rhotic accent characterized by strong bunched tongue /r/, voiced Flap T [ɾ] between vowels, and open unrounded /ɑ/ vowels.',
    keyPhoneticRules: [
      'Rhotic "R": Every /r/ is fully pronounced. Bunch the tongue body backward (e.g. "carrier", "order", "property").',
      'Flap T: Intervocalic /t/ becomes a voiced flap [ɾ] sounding like a rapid soft "d" (e.g. "water" → "wah-der", "waiting" → "way-ding").',
      'Open /ɑ/: Words with "o" like "policy", "lot", "bother" have unrounded open lips (/ˈpɑː.lə.si/).',
      'Schedule: Pronounced as /ˈskɛdʒ.uːl/ (sked-jool), unlike British /ʃɛd.juːl/.',
    ],
    youtubeReferences: [
      {
        title: 'Mastering the American R & Flap T Sounds',
        url: 'https://youtu.be/MCeBlOv-KJg?si=HwVcmW8_9kehzTU1',
        keyTakeaway: 'Focus on tongue bunching without touching the roof of the mouth for a clean American R sound.',
      },
      {
        title: 'American Vowel Shifts & Intonation in Business English',
        url: 'https://youtu.be/1i9kcBHX2Nw?si=eQPk3TWgijqzREd3',
        keyTakeaway: 'Keep vowel length uniform and drop pitch slightly at sentence ends for clear executive presence.',
      },
      {
        title: 'Workplace American Rhythm and Connected Speech',
        url: 'https://youtu.be/KLe7Rxkrj94?si=j-vTy06dwGehO85k',
        keyTakeaway: 'Smooth linking between words (e.g. "send it out" flows as "sen-di-tout").',
      },
    ],
  },
  uk: {
    id: 'uk',
    name: 'Received Pronunciation / Standard British (UK)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    locale: 'en-GB',
    summary: 'Non-rhotic accent featuring crisp aspirated True T sounds, broad open "ah" vowels (/ɑː/), and dropped post-vocalic R sounds.',
    keyPhoneticRules: [
      'Non-Rhotic "R": Drop the /r/ when following a vowel unless followed by another vowel (e.g. "carrier" → /ˈkæri.ə/, "endorsement" → /ɪnˈdɔːs.mənt/).',
      'True Aspirated T: Maintain a crisp, burst of air on /t/ between vowels; never soften into a flap (e.g. "water" → /ˈwɔː.tə/, "better" → /ˈbet.ə/).',
      'Broad A (/ɑː/): In words like "ask", "can\'t", "demand", open throat for a back /ɑː/ vowel.',
      'Schedule: Classically pronounced as /ˈʃɛd.juːl/ (shed-yool) in standard British professional environments.',
    ],
    youtubeReferences: [
      {
        title: 'British RP Non-Rhoticity and Vowel Positioning',
        url: 'https://youtu.be/nIwU-9ZTTJc?si=-2eR38Lq57Ob_W5',
        keyTakeaway: 'Practice dropping final R sounds and substituting clean schwa [ə] endings.',
      },
      {
        title: 'Standard British Workplace T & D Articulation',
        url: 'https://youtu.be/o8KqT5wD3E0?si=r7k5B1sZ9gQv_1t3',
        keyTakeaway: 'Crisp alveolar contact prevents Americanization and keeps clarity high for UK clients.',
      },
      {
        title: 'Intonation Patterns for Professional UK Communication',
        url: 'https://youtu.be/mF8iXyJ_f4E?si=26_jH91907YV_G8j',
        keyTakeaway: 'Subtle rising pitch on polite questions and steady downward tone on operational statements.',
      },
    ],
  },
  ca: {
    id: 'ca',
    name: 'Standard Canadian English',
    country: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    summary: 'Shares General American rhoticity and flap T, distinguished by Canadian Raising before voiceless consonants and unique vowel choices.',
    keyPhoneticRules: [
      'Canadian Raising: The diphthongs /aʊ/ and /aɪ/ raise to [ʌʊ] and [ʌɪ] before voiceless consonants like /t/, /p/, /k/, /s/ (e.g. "about", "out", "house", "price").',
      'Rhotic with Flap T: Shares American tongue-bunching /r/ and voiced flap [ɾ] in words like "city" and "better".',
      'The "Process" Vowel: In Canadian business, "process" is often pronounced as /ˈproʊ.sɛs/ (pro-sess with long O) rather than American /ˈprɑː.sɛs/.',
      'Vowel Merge: Low-back merger of /ɔ/ and /ɑ/ (words like "cot" and "caught" sound identical).',
    ],
    youtubeReferences: [
      {
        title: 'Understanding Canadian Raising: The Vowel Secret',
        url: 'https://youtu.be/1i9kcBHX2Nw?si=eQPk3TWgijqzREd3',
        keyTakeaway: 'Hear the distinct mid-central starting point of "about" [əˈbʌʊt] and "out" [ʌʊt].',
      },
      {
        title: 'Canadian vs. American English Workplace Nuances',
        url: 'https://youtu.be/MCeBlOv-KJg?si=HwVcmW8_9kehzTU1',
        keyTakeaway: 'Notice words like "process" and "schedule" in Canadian financial and insurance settings.',
      },
    ],
  },
};

const PRACTICE_SENTENCES = [
  'Could you please provide the signed binder so that we can confirm coverage bound for the auto fleet today?',
  'I am writing to provide an update: the loss runs were received, and the quote will be finalized tomorrow morning.',
  'Sir, as I see from the policy schedule, the property damage deductible is one thousand dollars per occurrence.',
  'The carrier has initiated subrogation against the negligent driver to recover your five hundred dollar deductible.',
  'Could you please confirm the vehicle identification number so that I can update the endorsement schedule?',
  'We need to verify the payroll audit numbers with the underwriter before the renewal deadline on Friday at five PM.',
];

// Helper to look up IPA representation
function getWordPhonetic(word: string, accent: AccentType): string {
  const clean = word.toLowerCase().replace(/[^\w]/g, '');
  const ipaTable: Record<string, { us: string; uk: string; ca: string }> = {
    could: { us: '/kʊd/', uk: '/kʊd/', ca: '/kʊd/' },
    you: { us: '/juː/', uk: '/juː/', ca: '/juː/' },
    please: { us: '/pliːz/', uk: '/pliːz/', ca: '/pliːz/' },
    provide: { us: '/prəˈvaɪd/', uk: '/prəˈvaɪd/', ca: '/prəˈvaɪd/' },
    the: { us: '/ðə/', uk: '/ðə/', ca: '/ðə/' },
    signed: { us: '/saɪnd/', uk: '/saɪnd/', ca: '/saɪnd/' },
    binder: { us: '/ˈbaɪn.dɚ/', uk: '/ˈbaɪn.də/', ca: '/ˈbaɪn.dɚ/' },
    so: { us: '/soʊ/', uk: '/səʊ/', ca: '/soʊ/' },
    that: { us: '/ðæt/', uk: '/ðæt/', ca: '/ðæt/' },
    we: { us: '/wiː/', uk: '/wiː/', ca: '/wiː/' },
    can: { us: '/kæn/', uk: '/kæn/', ca: '/kæn/' },
    confirm: { us: '/kənˈfɝːm/', uk: '/kənˈfɜːm/', ca: '/kənˈfɝːm/' },
    coverage: { us: '/ˈkʌv.ɚ.ɪdʒ/', uk: '/ˈkʌv.ər.ɪdʒ/', ca: '/ˈkʌv.ɚ.ɪdʒ/' },
    bound: { us: '/baʊnd/', uk: '/baʊnd/', ca: '/bʌʊnd/' },
    for: { us: '/fɔːr/', uk: '/fɔː/', ca: '/fɔːr/' },
    auto: { us: '/ˈɑː.t̬oʊ/', uk: '/ˈɔː.təʊ/', ca: '/ˈɑː.t̬oʊ/' },
    fleet: { us: '/fliːt/', uk: '/fliːt/', ca: '/fliːt/' },
    today: { us: '/təˈdeɪ/', uk: '/təˈdeɪ/', ca: '/təˈdeɪ/' },
    policy: { us: '/ˈpɑː.lə.si/', uk: '/ˈpɒl.ə.si/', ca: '/ˈpɑː.lə.si/' },
    schedule: { us: '/ˈskɛdʒ.uːl/', uk: '/ˈʃɛd.juːl/', ca: '/ˈskɛdʒ.uːl/' },
    carrier: { us: '/ˈkær.i.ɚ/', uk: '/ˈkær.i.ə/', ca: '/ˈkær.i.ɚ/' },
    endorsement: { us: '/ɪnˈdɔːrs.mənt/', uk: '/ɪnˈdɔːs.mənt/', ca: '/ɪnˈdɔːrs.mənt/' },
    water: { us: '/ˈwɑː.t̬ɚ/', uk: '/ˈwɔː.tə/', ca: '/ˈwɑː.t̬ɚ/' },
    about: { us: '/əˈbaʊt/', uk: '/əˈbaʊt/', ca: '/əˈbʌʊt/' },
    out: { us: '/aʊt/', uk: '/aʊt/', ca: '/ʌʊt/' },
    process: { us: '/ˈprɑː.sɛs/', uk: '/ˈprəʊ.sɛs/', ca: '/ˈproʊ.sɛs/' },
    deductible: { us: '/dɪˈdʌk.tə.bəl/', uk: '/dɪˈdʌk.tə.bəl/', ca: '/dɪˈdʌk.tə.bəl/' },
    subrogation: { us: '/ˌsʌb.rəˈɡeɪ.ʃən/', uk: '/ˌsʌb.rəˈɡeɪ.ʃən/', ca: '/ˌsʌb.rəˈɡeɪ.ʃən/' },
    update: { us: '/ˈʌp.deɪt/', uk: '/ˈʌp.deɪt/', ca: '/ˈʌp.deɪt/' },
    loss: { us: '/lɑːs/', uk: '/lɒs/', ca: '/lɑːs/' },
    runs: { us: '/rʌnz/', uk: '/rʌnz/', ca: '/rʌnz/' },
  };

  return ipaTable[clean]?.[accent] || `/${clean}/`;
}

// Levenshtein distance for word comparison
function wordDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const SYLLABLE_DICTIONARY: Record<string, string> = {
  schedule: 'sked · jool',
  process: 'pro · cess',
  water: 'wa · ter',
  carrier: 'car · ri · er',
  endorsement: 'en · dorse · ment',
  deductible: 'de · duct · i · ble',
  premium: 'pre · mi · um',
  liability: 'li · a · bil · i · ty',
  policyholder: 'pol · i · cy · hold · er',
  certificate: 'cer · tif · i · cate',
  underwriter: 'un · der · writ · er',
  commercial: 'com · mer · cial',
  documentation: 'doc · u · men · ta · tion',
  priority: 'pri · or · i · ty',
  confirm: 'con · firm',
  provide: 'pro · vide',
  signed: 'signed',
  binder: 'bind · er',
  coverage: 'cov · er · age',
  renewal: 're · new · al',
  subrogation: 'sub · ro · ga · tion',
  negligent: 'neg · li · gent',
  occurrence: 'oc · cur · rence',
  identification: 'i · den · ti · fi · ca · tion',
  payroll: 'pay · roll',
  fleet: 'fleet',
  today: 'to · day',
  thousand: 'thou · sand',
  dollars: 'dol · lars',
  hundred: 'hun · dred',
};

export function getWordSyllables(word: string): string {
  const clean = word.toLowerCase().replace(/[^\w]/g, '');
  if (SYLLABLE_DICTIONARY[clean]) return SYLLABLE_DICTIONARY[clean];
  if (clean.length <= 4) return clean;
  return clean.replace(/([aeiouy]+[^aeiouy]+)/gi, '$1·').replace(/·$/, '').replace(/·/g, ' · ');
}

interface PronunciationViewProps {
  currentUser?: UserProfile;
  onPronunciationCompleted?: (accuracyScore: number) => void;
}

export const PronunciationView: React.FC<PronunciationViewProps> = ({
  currentUser,
  onPronunciationCompleted,
}) => {
  const [selectedAccent, setSelectedAccent] = useState<AccentType>('us');
  const [sentence, setSentence] = useState(PRACTICE_SENTENCES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualSpokenText, setManualSpokenText] = useState('');

  const currentProfile = ACCENT_PROFILES[selectedAccent];
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const timerIntervalRef = useRef<any>(null);

  // Re-fetch speech synthesis voices when available
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize Speech Recognition with continuous & interim enabled
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript + ' ';
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        const combined = (finalStr + interimStr).trim();
        accumulatedTranscriptRef.current = combined;
        setLiveTranscript(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          setRecordingError('Microphone permission denied. Click "Manual Text Check" to evaluate typed input or allow microphone access.');
          setIsRecording(false);
        } else if (event.error === 'no-speech') {
          // Keep listening, do not terminate immediately
          console.log('Listening for user voice...');
        }
      };

      recognition.onend = () => {
        // If recording was supposed to be active and ended unintentionally, restart or finalize
        if (isRecording) {
          setIsRecording(false);
          clearInterval(timerIntervalRef.current);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  // Audio playback using SpeechSynthesis with accent matching
  const handlePlayAccentSound = (customText?: string) => {
    const textToSpeak = customText || sentence;
    if (!textToSpeak.trim()) return;

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const voices = window.speechSynthesis.getVoices();
    let matchedVoice: SpeechSynthesisVoice | null = null;

    if (selectedAccent === 'uk') {
      matchedVoice = voices.find(v => v.lang.includes('en-GB') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('uk')) || null;
      utterance.pitch = 1.05;
      utterance.rate = 0.95;
    } else if (selectedAccent === 'ca') {
      matchedVoice = voices.find(v => v.lang.includes('en-CA') || v.name.toLowerCase().includes('canadian')) || null;
      utterance.pitch = 1.0;
      utterance.rate = 0.98;
    } else {
      // US
      matchedVoice = voices.find(v => v.lang.includes('en-US') && !v.name.toLowerCase().includes('uk')) || null;
      utterance.pitch = 0.98;
      utterance.rate = 1.0;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      utterance.lang = currentProfile.locale;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start Voice Input
  const startRecording = () => {
    setRecordingError(null);
    setLiveTranscript('');
    accumulatedTranscriptRef.current = '';
    setEvaluation(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = currentProfile.locale;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err: any) {
        console.warn('Could not start recognition:', err);
        setRecordingError('Could not access microphone. You can type in your spoken words or allow browser permissions.');
      }
    } else {
      setRecordingError('Speech Recognition is not natively supported in this browser. Please use the Manual Text Check tab below.');
    }
  };

  // Stop Recording and trigger thorough evaluation
  const stopRecordingAndEvaluate = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);

    const spokenText = accumulatedTranscriptRef.current.trim();
    if (!spokenText) {
      setRecordingError('No spoken words were detected. Please ensure your microphone is working and speak clearly.');
      return;
    }

    runEvaluation(spokenText, sentence, selectedAccent);
  };

  const cancelRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
    setLiveTranscript('');
    accumulatedTranscriptRef.current = '';
  };

  // Run thorough evaluation (Client + Server AI fallback)
  const runEvaluation = async (spokenText: string, targetText: string, accent: AccentType) => {
    setIsEvaluating(true);
    setRecordingError(null);

    // Try server-side AI evaluation first for nuanced phonetics
    try {
      const response = await fetch(`${API_BASE}/pronunciation-evaluate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          spokenText,
          targetText,
          accent,
          userId: currentUser?.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEvaluation(result);
        onPronunciationCompleted?.(result.accuracyScore || 0);
        setIsEvaluating(false);
        return;
      }
    } catch {
      // Fallback to local intelligent alignment
    }

    // Intelligent Local Phonetic Alignment
    const localResult = performLocalEvaluation(spokenText, targetText, accent);
    setEvaluation(localResult);
    onPronunciationCompleted?.(localResult.accuracyScore || 0);
    setIsEvaluating(false);
  };

  // Intelligent local sequence alignment
  const performLocalEvaluation = (spokenText: string, targetText: string, accent: AccentType): PronunciationEvaluation => {
    const rawTargetWords = targetText.trim().split(/\s+/);
    const cleanTargetWords = rawTargetWords.map(w => w.toLowerCase().replace(/[^\w]/g, ''));
    const spokenTokens = spokenText.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const wordsFeedback: WordPronunciationFeedback[] = [];

    // Alignment matching with sliding window search
    let spokenIdx = 0;
    for (let i = 0; i < cleanTargetWords.length; i++) {
      const targetW = cleanTargetWords[i];
      const origW = rawTargetWords[i];
      const ipa = getWordPhonetic(targetW, accent);

      // Check upcoming 3 spoken words to handle skipped or inserted words
      let foundIndex = -1;
      let isNear = false;

      for (let s = spokenIdx; s < Math.min(spokenIdx + 4, spokenTokens.length); s++) {
        const spokenW = spokenTokens[s];
        if (spokenW === targetW) {
          foundIndex = s;
          isNear = false;
          break;
        } else if (targetW.length > 3 && (targetW.includes(spokenW) || spokenW.includes(targetW))) {
          foundIndex = s;
          isNear = true;
          break;
        } else if (wordDistance(targetW, spokenW) <= 2 && targetW.length > 4) {
          foundIndex = s;
          isNear = true;
          break;
        }
      }

      if (foundIndex !== -1) {
        spokenIdx = foundIndex + 1;
        if (!isNear) {
          matchCount += 1.0;
          wordsFeedback.push({
            word: origW,
            targetIpa: ipa,
            status: 'correct',
          });
        } else {
          matchCount += 0.75;
          wordsFeedback.push({
            word: origW,
            targetIpa: ipa,
            status: 'near',
            tip: `Detected "${spokenTokens[foundIndex]}". Target ${currentProfile.name}: ${ipa}`,
          });
        }
      } else {
        wordsFeedback.push({
          word: origW,
          targetIpa: ipa,
          status: 'missed',
          tip: `Word missed or unclear. Target ${currentProfile.name}: ${ipa}`,
        });
      }
    }

    const accuracyScore = Math.min(100, Math.round((matchCount / Math.max(1, cleanTargetWords.length)) * 100));

    // Accent specific guidance
    const accentSpecificFeedback: string[] = [];
    const waysToFix: Array<{ feature: string; explanation: string; practiceDrill: string }> = [];

    if (accent === 'us') {
      accentSpecificFeedback.push('General American is strongly rhotic: Keep your tongue tip slightly raised and bunched back without touching the roof of the mouth.');
      accentSpecificFeedback.push('Intervocalic T sounds (like in "auto", "water", "schedule") must be voiced as a gentle Flap T [ɾ] rather than a sharp British [t].');
      waysToFix.push({
        feature: 'Flap T Articulation',
        explanation: 'Allow the tongue tip to tap lightly against the tooth ridge. Say "auto fleet" as "ah-doh fleet".',
        practiceDrill: 'Repeat: "Could you please write it down later?" (sound like "ray-der").',
      });
      waysToFix.push({
        feature: 'Open /ɑ/ Jaw Drop',
        explanation: 'Drop your lower jaw straight down for words like "policy", "lot", "dollar" with relaxed lips.',
        practiceDrill: 'Repeat: "Policy schedule" → /ˈpɑː.lə.si ˈskɛdʒ.uːl/.',
      });
    } else if (accent === 'uk') {
      accentSpecificFeedback.push('Standard British RP is non-rhotic: Drop the "r" when it occurs at the end of syllables or words (e.g. "binder" → /ˈbaɪn.də/, "carrier" → /ˈkær.i.ə/).');
      accentSpecificFeedback.push('Maintain crisp True T sounds: Release a firm burst of air on "t" in words like "water", "better", "waiting".');
      waysToFix.push({
        feature: 'Non-Rhotic Schwa Endings',
        explanation: 'Do not curl the tongue back at the end of words ending in "-er" or "-or". End with a relaxed [ə] vowel.',
        practiceDrill: 'Repeat: "The carrier issued the binder" → [ðə ˈkæri.ə ˈɪʃuːd ðə ˈbaɪn.də].',
      });
      waysToFix.push({
        feature: 'Crisp Aspirated T',
        explanation: 'Press the tongue firmly behind upper front teeth and release clean air without voicing.',
        practiceDrill: 'Repeat: "Could you write to the water contractor?" with sharp [t] bursts.',
      });
    } else if (accent === 'ca') {
      accentSpecificFeedback.push('Canadian Raising: Raise the starting vowel in diphthongs /aʊ/ and /aɪ/ when preceding voiceless consonants like T, P, K (e.g. "about", "out", "house").');
      accentSpecificFeedback.push('Notice the Canadian pronunciation of "process" as /ˈproʊ.sɛs/ with a long O sound.');
      waysToFix.push({
        feature: 'Canadian Raising on "Out / About"',
        explanation: 'Start the diphthong higher with a mid-central sound [ʌ] rather than an open [a]. The jaw does not drop as low.',
        practiceDrill: 'Repeat: "Following up about the payout" → hear the raised vowel in both "about" and "out".',
      });
      waysToFix.push({
        feature: 'Canadian "Process" Vowel',
        explanation: 'Pronounce the first syllable with a clean long O like "pro" rather than the American "prah".',
        practiceDrill: 'Repeat: "We will pro-cess the endorsement today."',
      });
    }

    const overallAssessment = accuracyScore >= 85
      ? `Outstanding pronunciation accuracy for ${currentProfile.name}. Your pacing, phonemes, and stress align well with workplace expectations.`
      : accuracyScore >= 65
        ? `Solid attempt. Review the highlighted yellow/red words and practice the accent drills below to reach 85%+ client-ready standard.`
        : `Needs focused practice. Listen to the accent audio sample above, observe tongue positioning in the reference videos, and try again.`;

    return {
      accuracyScore,
      recognizedText: spokenText,
      targetText,
      accent,
      words: wordsFeedback,
      accentSpecificFeedback,
      waysToFix,
      overallAssessment,
    };
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Voice & Accent Laboratory
            </span>
            <span className="text-xs text-slate-500 font-medium">US • UK • Canadian Standards</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Accent Pronunciation & Accuracy Checker
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Check how any sentence sounds across US, UK, and Canadian English accents. Practice speaking with high-accuracy voice capture, receive word-by-word phonetic analysis, and master physical mouth and tongue drills.
          </p>
        </div>
      </div>

      {/* Accent Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(ACCENT_PROFILES) as AccentType[]).map((accKey) => {
          const profile = ACCENT_PROFILES[accKey];
          const isSelected = selectedAccent === accKey;
          return (
            <button
              key={accKey}
              onClick={() => {
                setSelectedAccent(accKey);
                if (evaluation) {
                  // Re-evaluate current transcript with newly chosen accent
                  if (evaluation.recognizedText) {
                    runEvaluation(evaluation.recognizedText, sentence, accKey);
                  }
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{profile.flag}</span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Active Accent
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{profile.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{profile.summary}</p>
            </button>
          );
        })}
      </div>

      {/* Target Sentence Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Target Sentence to Pronounce
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Quick Samples:</span>
            <select
              value={sentence}
              onChange={(e) => {
                setSentence(e.target.value);
                setEvaluation(null);
                setLiveTranscript('');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 max-w-[240px] truncate"
            >
              {PRACTICE_SENTENCES.map((s, idx) => (
                <option key={idx} value={s}>
                  Sample {idx + 1}: {s.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Editable Sentence Textarea */}
        <div className="space-y-2">
          <textarea
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
              setEvaluation(null);
            }}
            rows={3}
            className="w-full text-lg md:text-xl font-medium text-slate-900 p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none leading-relaxed"
            placeholder="Type any sentence here to test pronunciation..."
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You can edit or paste any workplace sentence above.</span>
            <span>Target: {sentence.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {/* Audio Sample Player in Selected Accent */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayAccentSound()}
              disabled={isPlayingAudio}
              className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title="Listen in target accent"
            >
              {isPlayingAudio ? <RotateCw className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Listen in {currentProfile.name}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                  Audio Model
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Native pitch, rate, and phonetic cadence configured for {currentProfile.country}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAccentSound(sentence)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition-colors"
            >
              Play Normal Speed
            </button>
          </div>
        </div>

        {/* RECORDING / VOICE INPUT SECTION */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Pronunciation Recording
            </span>
            <button
              onClick={() => setManualInputMode(!manualInputMode)}
              className="text-xs text-emerald-700 hover:underline font-medium"
            >
              {manualInputMode ? 'Switch to Microphone Input' : 'Type or simulate voice input instead'}
            </button>
          </div>

          {/* Error Message if Mic Blocked */}
          {recordingError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{recordingError}</p>
                <p className="text-amber-800">
                  Tip: If your browser blocks microphone in this iframe preview, click <strong>"Type or simulate voice input instead"</strong> above to test accuracy analysis instantly.
                </p>
              </div>
            </div>
          )}

          {/* Active Voice Input Interface */}
          {!manualInputMode ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-5">
              {!isRecording ? (
                <>
                  <div className="p-5 rounded-full bg-emerald-50 text-emerald-700 shadow-inner">
                    <Mic className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Ready to record your pronunciation
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md">
                      Click the button below to start. The system will patiently wait and record your full sentence without cutting you off. When you finish, click <strong>"Done Speaking (Evaluate)"</strong>.
                    </p>
                  </div>
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Mic className="w-5 h-5" />
                    Start Speaking
                  </button>
                </>
              ) : (
                <div className="w-full space-y-5">
                  {/* Recording status with timer and animated wave bars */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Recording in progress: {formatTime(recordingSeconds)}
                    </span>
                  </div>

                  {/* Pulsing Visual Waveform */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    {[40, 75, 55, 90, 60, 85, 45, 95, 70, 80, 50, 65, 88, 42].map((height, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-emerald-600 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(15, (height * (1 + (recordingSeconds % 3) * 0.2)) % 100)}%`,
                          animationDelay: `${i * 70}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Real-time live transcript container */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Live Voice Detection
                    </div>
                    <p className="text-base text-slate-900 font-medium italic min-h-[30px]">
                      {liveTranscript || 'Listening to your voice... Speak the sentence clearly.'}
                    </p>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={stopRecordingAndEvaluate}
                      className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Done Speaking (Evaluate Now)
                    </button>
                    <button
                      onClick={cancelRecording}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Manual / Simulated Voice Input */
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Type what you said (or paste transcribed speech)
                </span>
                <button
                  onClick={() => setManualSpokenText(sentence)}
                  className="text-xs text-emerald-700 hover:underline"
                >
                  Use Target as Test (100% Match)
                </button>
              </div>
              <textarea
                value={manualSpokenText}
                onChange={(e) => setManualSpokenText(e.target.value)}
                placeholder="Type your spoken words here..."
                rows={3}
                className="w-full text-base p-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                onClick={() => runEvaluation(manualSpokenText, sentence, selectedAccent)}
                disabled={!manualSpokenText.trim() || isEvaluating}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isEvaluating ? 'Analyzing...' : 'Evaluate Spoken Text'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EVALUATION RESULTS & ACCENT BREAKDOWN */}
      {evaluation && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                  Pronunciation Accuracy Report
                </span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-md text-slate-300 font-mono">
                  {currentProfile.name}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {evaluation.overallAssessment}
              </h3>
              <p className="text-xs text-slate-300">
                Spoken Input: "{evaluation.recognizedText}"
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-4 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700 self-start sm:self-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">
                  {evaluation.accuracyScore}%
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Accuracy Score
                </div>
              </div>
            </div>
          </div>

          {/* Word-by-Word Phonetic Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Word-by-Word Alignment & Phonetics
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Near Match
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Missed / Muffled
                </span>
              </div>
            </div>

            {/* Chips Grid */}
            <div className="flex flex-wrap gap-2.5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              {evaluation.words.map((w, idx) => {
                const isCorrect = w.status === 'correct';
                const isNear = w.status === 'near';

                return (
                  <div
                    key={idx}
                    onClick={() => handlePlayAccentSound(w.word)}
                    className={`cursor-pointer group flex flex-col items-center px-3 py-2 rounded-xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                        : isNear
                          ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                          : 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100'
                    }`}
                    title={w.tip || `Click to hear "${w.word}" in ${currentProfile.name}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm">{w.word}</span>
                      <Volume2 className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {w.targetIpa}
                    </span>
                    <span className="text-[9px] font-mono text-slate-700 bg-white/80 border border-slate-200/80 px-1.5 py-0.5 rounded-md mt-1 tracking-wide">
                      {getWordSyllables(w.word)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 italic">
              Tip: Click any word badge above to hear native pronunciation and mouth resonance in {currentProfile.name}.
            </p>
          </div>

          {/* Accent-Specific Phonetic Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Key Accent Features */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {currentProfile.name} Sound Signature
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {evaluation.accentSpecificFeedback.map((fb, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Ways to Fix & Physical Articulation Drills */}
            <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-emerald-950">
                  Ways to Fix & Practice Drills
                </h4>
              </div>
              <div className="space-y-3">
                {evaluation.waysToFix.map((item, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1.5 shadow-xs">
                    <div className="text-xs font-bold text-emerald-900">
                      {i + 1}. {item.feature}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {item.explanation}
                    </p>
                    <div className="bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] text-emerald-800 font-medium">
                      🎯 Drill: {item.practiceDrill}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CURATED YOUTUBE VIDEO TUTORIALS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Curated Accent Mastery Tutorials ({currentProfile.name})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Official Recommended Video Lessons</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentProfile.youtubeReferences.map((ref, idx) => (
            <a
              key={idx}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
                <span className="flex items-center gap-1">
                  <Youtube className="w-3.5 h-3.5" /> Video Lesson {idx + 1}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {ref.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {ref.keyTakeaway}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Mr. Cuckoo Advice */}
      <MrCuckoo
        variant="card"
        title="Mr. Cuckoo's Voice & Accent Coaching"
        message="Client clarity doesn't require a theatrical foreign accent—it requires phonological precision. In the US, master the rhotic R and gentle Flap T. In the UK, aspire your True T and drop post-vocalic R. In Canada, mind the raised diphthongs in 'about' and 'out'."
      />
    </div>
  );
};
