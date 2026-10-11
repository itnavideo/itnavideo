import { cleanWord, isWordActive } from '../remotion/captions/utils/cleanWord';
import { getActiveWord } from '../remotion/utils/subtitleUtils';

const words = [
  { word: 'Hello,', start: 0, end: 0.5 },
  { word: 'world!', start: 0.5, end: 1.0 },
  { word: 'This', start: 1.0, end: 1.5 },
  { word: 'is', start: 1.5, end: 1.8 },
  { word: 'how', start: 1.8, end: 2.1 },
  { word: 'you', start: 2.1, end: 2.5 },
  { word: 'GROW', start: 2.5, end: 3.2 },
  { word: 'your', start: 3.2, end: 3.6 },
  { word: 'business,', start: 3.6, end: 4.2 },
  { word: 'fast.', start: 4.2, end: 5.0 },
];

const fps = 30;
const testFrames = [10, 40, 70, 100, 130];

console.log('--- WORD TIMING & CLEAN WORD PROOF ---');

testFrames.forEach((frame) => {
  const timeSec = frame / fps;
  const activeWordObj = getActiveWord(words, timeSec);
  const activeWord = activeWordObj ? activeWordObj.word : 'None';
  console.log(`Frame ${frame} (${timeSec.toFixed(2)}s): Active Word = "${activeWord}"`);
});

console.log('\n--- CLEAN WORD & IS WORD ACTIVE PROOF ---');
console.log(`cleanWord("Hello,") => "${cleanWord('Hello,')}"`);
console.log(`cleanWord("world!") => "${cleanWord('world!')}"`);
console.log(`isWordActive("Hello,", "Hello,") => ${isWordActive('Hello,', 'Hello,')}`);
console.log(`isWordActive("Hello,", "hello") => ${isWordActive('Hello,', 'hello')}`);
console.log(`isWordActive("world!", "world") => ${isWordActive('world!', 'world')}`);
