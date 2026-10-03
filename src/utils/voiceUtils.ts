// ClearCue Speech & Voice Synthesis Utilities

export function getSoftAnimatedCuckooVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Prioritize gentle, soft, animated female AI voices across platforms
  // Explicitly avoid deep adult male voices like Daniel, David, George, Oliver
  const preferredSoftNames = [
    'Microsoft Jenny Online (Natural)',
    'Microsoft Aria Online (Natural)',
    'Microsoft Zira',
    'Google US English',
    'Samantha',
    'Victoria',
    'Karen',
    'Moira',
    'Tessa',
  ];

  for (const name of preferredSoftNames) {
    const found = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (found) return found;
  }

  // Next: find any English voice that is explicitly female or not deep male
  const fallbackSoft = voices.find((v) => {
    const lowerName = v.name.toLowerCase();
    const isEn = v.lang.startsWith('en');
    const isDeepMale =
      lowerName.includes('daniel') ||
      lowerName.includes('david') ||
      lowerName.includes('george') ||
      lowerName.includes('oliver') ||
      lowerName.includes('alex') ||
      lowerName.includes('male') ||
      lowerName.includes('fred');
    return isEn && !isDeepMale;
  });

  return fallbackSoft || voices.find((v) => v.lang.startsWith('en')) || null;
}

export interface VoiceToneConfig {
  rate: number;
  pitch: number;
  volume: number;
}

export function getMockCallToneConfig(tone: 'rude' | 'polite' | 'normal', isMale: boolean): VoiceToneConfig {
  switch (tone) {
    case 'rude':
      // Impatient, clipped, sharp, hurried cadence with high tension
      return {
        rate: 1.20, // noticeably faster, impatient
        pitch: isMale ? 0.86 : 1.26, // sharp, stressed tone
        volume: 1.0,
      };
    case 'polite':
      // Warm, patient, gentle, appreciative cadence
      return {
        rate: 0.92, // calm, unhurried, measured
        pitch: isMale ? 1.05 : 1.18, // gentle warmth, friendly
        volume: 0.90,
      };
    case 'normal':
    default:
      // Neutral, crisp, standard business pace
      return {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.95,
      };
  }
}
