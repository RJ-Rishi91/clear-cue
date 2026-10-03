import { AccentProfile } from '../types';

export const ACCENT_PROFILES: AccentProfile[] = [
  {
    id: 'us',
    name: 'General American (US)',
    country: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    summary: 'Rhotic accent with flap T intervocalically, open unrounded vowels, and characteristic rhythm.',
    keyPhoneticRules: [
      'Full Rhoticity: Every "r" sound is articulated clearly with the tongue retroflexed or bunched (e.g. "carrier", "order", "policyholder").',
      'Flap T [ɾ]: When "t" or "d" occurs between vowel sounds, it becomes a voiced alveolar tap/flap sounding like a light "d" (e.g., "water" → "wah-der", "better" → "beh-der", "waiting" → "way-ding").',
      'Flat A [/æ/]: Words like "half", "ask", "can\'t", "path", "bath" use the open front unrounded vowel /æ/ rather than the British broad /ɑː/.',
      'Unrounded LOT Vowel [/ɑ/]: In words like "policy", "lot", "bother", "hot", the vowel is open and unrounded /ɑ/.',
      'Downward Intonation Contour: Assertive, direct statements drop pitch smoothly at the end of the sentence.',
    ],
    youtubeReferences: [
      {
        title: 'American Accent Training: Master Sounds & Rhythm',
        url: 'https://youtu.be/MCeBlOv-KJg?si=HwVcmW8_9kehzTU1',
        keyTakeaway: 'Focus on mouth shapes, jaw relaxation, and the transition between voiced flap T and clear R-coloring.',
      },
      {
        title: 'US Pronunciation Masterclass: Linking & Fluency',
        url: 'https://youtu.be/1i9kcBHX2Nw?si=eQPk3TWgijqzREd3',
        keyTakeaway: 'How to link final consonants into initial vowels smoothly without staccato stops (e.g., "send it over" → "sen-di-tover").',
      },
      {
        title: 'American Vowel Reductions & Schwa',
        url: 'https://youtu.be/KLe7Rxkrj94?si=j-vTy06dwGehO85k',
        keyTakeaway: 'Unstressed syllables reduce to /ə/ (schwa), ensuring key insurance terms receive correct lexical stress.',
      },
    ],
  },
  {
    id: 'uk',
    name: 'Standard British (RP)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    locale: 'en-GB',
    summary: 'Non-rhotic prestige accent with crisp True T, rounded short vowels, and melodic pitch movement.',
    keyPhoneticRules: [
      'Non-Rhoticity: The "r" sound is silent unless immediately followed by a vowel (e.g. "car" → /kɑː/, "carrier" → /ˈkæri.ə/, "water" → /ˈwɔː.tə/, "endorsement" → /ɪnˈdɔːsmənt/).',
      'Crisp True T: Intervocalic "t" is clearly articulated with aspiration or clean release, NEVER flapped into a "d" (e.g. "water" is "waw-tuh", not "wah-der").',
      'Broad A [/ɑː/]: Words like "bath", "ask", "can\'t", "demand", "half" take the long back vowel /ɑː/ (sounds like "bahth", "ahsk", "cahn\'t").',
      'Rounded Short O [/ɒ/]: Words like "policy", "cost", "document", "lot" require rounded lips and a retracted tongue.',
      'Polite Fall-Rise Intonation: Courteous requests ("Could you please...") feature a characteristic high-head and gentle fall-rise cadence.',
    ],
    youtubeReferences: [
      {
        title: 'British English RP Pronunciation: Core Sounds',
        url: 'https://youtu.be/nIwU-9ZTTJc?si=-2eR38Lq57Ob_W5P',
        keyTakeaway: 'Mastering the non-rhotic vowel lengths and avoiding accidental American flapping on internal T sounds.',
      },
      {
        title: 'UK Accent Guide: Vowels & Intonation Melody',
        url: 'https://youtu.be/SLEvWp8JS1c?si=8nod0EEtgbuImKeA',
        keyTakeaway: 'RP pitch ranges, British syllable timing, and standard workplace courtesy modulation.',
      },
    ],
  },
  {
    id: 'ca',
    name: 'Canadian English',
    country: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    summary: 'Shares General American rhoticity with distinct Canadian Raising, vowel shifts, and specific lexical stress.',
    keyPhoneticRules: [
      'Canadian Raising: The diphthongs /aʊ/ and /aɪ/ raise to [ʌʊ] and [ʌɪ] before voiceless consonants (/p, t, k, s, f, θ/). Hear it distinctly in "about" [əˈbʌʊt], "out" [ʌʊt], "house" [hʌʊs], "write" [rʌɪt], "price" [prʌɪs].',
      'Low-Back Merger (Cot-Caught): "Cot" and "caught" are pronounced identically with the open back unrounded/lightly rounded vowel [ɑ~ɒ].',
      'Full Rhoticity: Like American English, all "r" consonants are voiced and articulated (e.g., "carrier", "endorsement", "first").',
      'Canadian Lexical Variants: "Process" is predominantly pronounced /ˈproʊ.sɛs/ (pro-sess with long O), unlike US /ˈprɑː.sɛs/ (prah-sess). "Schedule" is /ˈskɛdʒ.uːl/. "Been" is /biːn/ (bean).',
      'Courteous Tag & Pitch: Friendly rising engagement or gentle question intonation ("eh?", consultative affirmation).',
    ],
    youtubeReferences: [
      {
        title: 'Canadian Raising: The Linguistic Secret of Canadian English',
        url: 'https://youtu.be/hoXeOWf_2xY?si=MUL3Ypk3JzkNPXJW',
        keyTakeaway: 'Understand exactly how and why diphthongs raise before voiceless consonants like T, P, K, and S.',
      },
      {
        title: 'Canadian vs American Accent Differences Explained',
        url: 'https://youtu.be/IzFSt02v89k?si=7-ZJpodMv1Z4ibJO',
        keyTakeaway: 'Subtle differences in vowel quality, lexical words like "process" and "schedule", and conversational pacing.',
      },
    ],
  },
];

export const PRONUNCIATION_SAMPLE_SENTENCES = [
  {
    id: 's1',
    category: 'Request',
    sentence: 'Could you please send the policy schedule by 3:00 PM EST?',
    accentNotes: {
      us: 'Flap T in "schedule" (/ˈskɛdʒəl/), clear R in "order", "Could you" links smoothly.',
      uk: 'Non-rhotic drop on "EST" if followed by consonant; clear true T in "schedule" (/ˈʃɛdjuːl/ or /ˈskɛdjuːl/).',
      ca: 'Canadian Raising in "out/about" if present; Canadian pronunciation of "schedule" (/ˈskɛdʒ.uːl/).',
    },
  },
  {
    id: 's2',
    category: 'Insurance Update',
    sentence: 'The loss runs for the commercial property account are under review.',
    accentNotes: {
      us: 'Unrounded vowel in "property" (/ˈprɑː.pɚ.t̬i/) with flap T; rhotic "commercial" and "under".',
      uk: 'Rounded vowel in "property" (/ˈprɒp.ə.ti/) with true T; drop R in "commercial" (/kəˈmɜː.ʃəl/) and "under" (/ˈʌn.də/).',
      ca: 'Rhotic "commercial"; low-back merged vowel in "property".',
    },
  },
  {
    id: 's3',
    category: 'Zero-Blame Courtesy',
    sentence: 'Sir, as I see that there are documents missing, I would appreciate your support so that I can proceed.',
    accentNotes: {
      us: 'Flap T in "documents" and "appreciate" linked; assertive yet polite low-pitch landing.',
      uk: 'Crisp true T in "documents" and "support"; polite rising pitch contour on courtesy opening.',
      ca: 'Canadian Raising in "proceed" and "appreciate"; rhotic "sir" and "support".',
    },
  },
  {
    id: 's4',
    category: 'Action Taken & Ahead',
    sentence: 'Action Taken: I contacted the carrier regarding the endorsement today. Action Ahead: Following up tomorrow.',
    accentNotes: {
      us: 'Flap T in "contacted" (/ˈkɑːn.tæk.tɪd/); rhotic "carrier" and "endorsement".',
      uk: 'Non-rhotic "carrier" (/ˈkæri.ə/) and "endorsement" (/ɪnˈdɔːsmənt/); true T in "contacted".',
      ca: 'Rhotic R in both words; distinct Canadian vowels in "contacted" and "tomorrow".',
    },
  },
  {
    id: 's5',
    category: 'Operational Specifics',
    sentence: 'We require 2 signed endorsement forms for policy number GL-1049 by Friday.',
    accentNotes: {
      us: 'Flap T in "Friday"; clear R throughout; numbers "GL-1049" enunciated with stress on final digits.',
      uk: 'Non-rhotic "endorsement" and "number"; crisp D in "Friday".',
      ca: 'Canadian Raising on the diphthong in "Friday" [frʌɪ-day]; clean rhotic pronunciation.',
    },
  },
];
