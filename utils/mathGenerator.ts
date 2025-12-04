import { MathProblem } from '../types';

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random ID for problems
const generateId = () => {
  // Fallback for environments without crypto.randomUUID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Simple fallback using timestamp and random number
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const generateProblem = (): MathProblem => {
  // We want the answer to be strictly a single digit (0-9) for the numpad
  const answer = randomInt(0, 9);
  const operator = Math.random() > 0.5 ? '+' : '-';

  let a: number, b: number;

  if (operator === '+') {
    // a + b = answer
    // a can be anywhere from 0 to answer
    a = randomInt(0, answer);
    b = answer - a;
  } else {
    // a - b = answer
    // a must be >= answer. Let's cap inputs at 18 to keep it simple mental math
    b = randomInt(0, 9);
    a = answer + b;
  }

  return {
    id: generateId(),
    expression: `${a} ${operator} ${b}`,
    answer,
  };
};

export const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
