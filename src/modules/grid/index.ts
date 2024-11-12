import { store } from '../../store';
import { LocaleGridConfig, Locale } from '../../types';
import { HOURS, MINUTES } from './constants';
import enUS from './en-US';
import esES from './es-ES';
import frFR from './fr-FR';
import itIT from './it-IT';
import ptPT from './pt-PT';
import elGR from './el-GR';
import deDE from './de-DE';
import caES from './ca-ES';

const LOCALE_CONFIG: Record<Locale, LocaleGridConfig> = {
  'en-US': enUS,
  'es-ES': esES,
  'it-IT': itIT,
  'fr-FR': frFR,
  'pt-PT': ptPT,
  'el-GR': elGR,
  'de-DE': deDE,
  'ca-ES': caES,
};

function getLocaleConfig(locale: Locale) {
  return LOCALE_CONFIG[locale];
}

export function getWordsKeys(locale: Locale, time: string) {
  const { getLocaleWordKeys } = getLocaleConfig(locale);
  const wordKeys = [];

  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(':').map((t) => parseInt(t));
  if (minutes >= 35) {
    hours = (hours + 1) % 12 || 12;
  }

  wordKeys.push(HOURS[hours % 12]);
  if (minutes >= 5) {
    wordKeys.push(MINUTES[Math.floor(minutes / 5) - 1]);
  }

  return [...getLocaleWordKeys(hours, minutes), ...wordKeys];
}

export function highlightGrid(time: string) {
  const locale = store.get('locale');
  const { localeWords, commonWords, getCustomWordKeys } = getLocaleConfig(locale);
  let words: number[][] = [];

  const clockWords = {
    ...commonWords,
    ...localeWords,
  };

  document.querySelector('#clock')?.classList.add('loading');

  const wordsKeys = getCustomWordKeys ? getCustomWordKeys(locale, time) : getWordsKeys(locale, time);

  wordsKeys
    .map((word) => clockWords[word as keyof typeof clockWords])
    .forEach((item) => {
      if (typeof item === 'function') {
        const [hours, minutes] = time.split(':').map((t) => parseInt(t));
        item = item(hours, minutes);
      }
      if (Array.isArray(item[0])) words = words.concat(item);
      else words.push(item as number[]);
    });

  let longestWord = 0;
  document.documentElement.style.removeProperty('--longest-word');

  const chars = document.querySelectorAll<HTMLDivElement>('#clock .char');
  chars.forEach((cell) => cell.classList.remove('active'));

  setTimeout(() => {
    words.forEach((word, wordIdx) => {
      longestWord = Math.max(word.length, longestWord);

      word.forEach((index, pos) => {
        const char = chars[index];

        char.classList.add('active');
        char.classList.toggle('first', pos === 0);
        char.classList.toggle('last', pos === word.length - 1);

        char.dataset.word = wordIdx.toString();
      });

      if (longestWord > 0) {
        document.documentElement.style.setProperty('--longest-word', longestWord.toString());
      }

      document.querySelector('#clock')?.classList.remove('loading');
    });
  }, 500);
}

export function drawGrid() {
  const clock = document.querySelector<HTMLDivElement>('#clock');
  const gridExists = !!document.querySelector<HTMLDivElement>('#clock .char');
  const { grid, charsWithAphostrophe, secondaryChars } = getLocaleConfig(store.get('locale'));

  grid
    .join('')
    .split('')
    .forEach((char, index) => {
      let charEl = document.querySelector<HTMLDivElement>(`#clock .char:nth-child(${index + 1})`);

      if (!charEl) {
        charEl = document.createElement('div');
      }

      charEl.classList.add('char');
      charEl.dataset.index = index.toString();
      charEl.classList.toggle('aphostrophe', !!charsWithAphostrophe?.includes(index));
      charEl.classList.toggle('secondary', !!secondaryChars?.includes(index));
      charEl.textContent = char;

      if (!gridExists) {
        clock?.appendChild(charEl);
      }
    });
}

export function initGrid() {
  drawGrid();
}
