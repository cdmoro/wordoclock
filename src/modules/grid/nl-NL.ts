import { CommonWords, LocaleGridConfig, WordKeys } from '../../types';

const grid = [
  'HETKISAVIJF', // 0-10 ("HET", "IS", "VIJF")
  'TIENATZVOOR', // 11-21 ("TIEN", "VOOR")
  'OVERMEKWART', // 22-32 ("OVER", "KWART")
  'HALFSPMOVER', // 33-43 ("HALF", "OVER")
  'VOORTHGÉÉNS', // 44-54 ("VOOR")
  'TWEEAMCDRIE', // 55-65 ("TWEE", "DRIE")
  'VIERVIJFZES', // 66-76 ("VIER", "VIJF", "ZES")
  'ZEVENONEGEN', // 77-87 ("ZEVEN", "NEGEN")
  'ACHTTIENELF', // 88-98 ("ACHT", "TIEN", "ELF")
  'TWAALFPMUUR', // 99-109 ("TWAALF", "UUR")
];

const commonWords: CommonWords = {
  TWELVE: [99, 100, 101, 102, 103], // TWAALF
  ONE: [51, 52, 53], // ÉÉN
  TWO: [55, 56, 57, 58], // TWEE
  THREE: [62, 63, 64, 65], // DRIE
  FOUR: [66, 67, 68, 69], // VIER
  FIVE: [70, 71, 72, 73], // VIJF
  SIX: [74, 75, 76], // ZES
  SEVEN: [77, 78, 79, 80, 81], // ZEVEN
  EIGHT: [88, 89, 90, 91], // ACHT
  NINE: [83, 84, 85, 86, 87], // NEGEN
  TEN: [92, 93, 94, 95], // TIEN
  ELEVEN: [96, 97, 98], // ELF
  FIVE_MIN: [7, 8, 9, 10], // VIJF (five minutes)
  TEN_MIN: [11, 12, 13, 14], // TIEN (ten minutes)
  QUARTER_MIN: [28, 29, 30, 31, 32], // KWART (quarter)
  TWENTY_MIN: [11, 12, 13, 14, 15], // TWINTIG (optional, if "twenty" is used in other variations)
  TWENTYFIVE_MIN: [
    [7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ],
  HALF: [33, 34, 35, 36], // HALF
};

const localeWords = {
  HET: [0, 1, 2], // HET
  IS: [4, 5], // IS
  VOOR: [44, 45, 46, 47], // VOOR
  OVER: [40, 41, 42, 43], // OVER
  KWART: [27, 28, 29, 30, 31], // KWART
  UUR: [107, 108, 109], // UUR
};

function getLocaleWordKeys(_hours: number, minutes: number) {
  const wordKeys: WordKeys<typeof localeWords>[] = ['HET', 'IS'];

  // Determine whether to use "OVER" or "VOOR" based on minutes
  if (minutes >= 35) {
    // Use "VOOR" (before) and move to the next hour
    wordKeys.push('VOOR');
  } else if (minutes < 30) {
    wordKeys.push('OVER');
  }

  // Use "UUR" for on-the-hour times
  if (minutes === 0) {
    wordKeys.push('UUR');
  }

  return wordKeys;
}

export default {
  grid,
  getLocaleWordKeys,
  commonWords,
  localeWords,
} satisfies LocaleGridConfig;
