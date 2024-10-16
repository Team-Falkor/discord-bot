import { evaluate } from "mathjs";

// Optimized Map for Roman numerals
const romanToNumMap = new Map<string, number>([
  ["I", 1],
  ["V", 5],
  ["X", 10],
  ["L", 50],
  ["C", 100],
  ["D", 500],
  ["M", 1000],
]);

// Optimized Map for words to numbers
const wordsToNumMap = new Map<string, number>([
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
  ["ten", 10],
  ["eleven", 11],
  ["twelve", 12],
  ["thirteen", 13],
  ["fourteen", 14],
  ["fifteen", 15],
  ["sixteen", 16],
  ["seventeen", 17],
  ["eighteen", 18],
  ["nineteen", 19],
  ["twenty", 20],
  ["thirty", 30],
  ["forty", 40],
  ["fifty", 50],
  ["sixty", 60],
  ["seventy", 70],
  ["eighty", 80],
  ["ninety", 90],
  ["hundred", 100],
  ["thousand", 1000],
]);

// Optimized Map for superscript numbers
const superscriptMap = new Map<string, number>([
  ["⁰", 0],
  ["¹", 1],
  ["²", 2],
  ["³", 3],
  ["⁴", 4],
  ["⁵", 5],
  ["⁶", 6],
  ["⁷", 7],
  ["⁸", 8],
  ["⁹", 9],
]);

// Converts a Roman numeral string to a number
const romanToNumber = (roman: string): number => {
  let total = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanToNumMap.get(roman[i].toUpperCase()) || 0;
    total += currentValue < prevValue ? -currentValue : currentValue;
    prevValue = currentValue;
  }

  return total;
};

// Converts a string representing a number in words to an actual number
const wordsToNumber = (words: string): number | null => {
  const wordsArray = words.toLowerCase().split(/[\s-]+/);
  let total = 0;
  let current = 0;

  for (const word of wordsArray) {
    const value = wordsToNumMap.get(word);
    if (value === undefined) return null;

    if (value >= 100) {
      current *= value;
    } else if (value >= 1000) {
      current *= value;
      total += current;
      current = 0;
    } else {
      current += value;
    }
  }

  return total + current;
};

// Converts a string containing superscript numbers to a regular number
const superscriptToNumber = (input: string): number | null => {
  let result = 0;

  for (const char of input) {
    const value = superscriptMap.get(char);
    if (value === undefined) return null; // Return null if an invalid superscript is found
    result = result * 10 + value;
  }

  return result;
};

// Helper function to replace superscript characters in a string with their numeric equivalents
const replaceSuperscripts = (input: string): string => {
  return input.replace(
    /[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,
    (char) => superscriptMap.get(char)?.toString() || char
  );
};

// Safely evaluates a math expression using mathjs
const safeEval = (expression: string): number | null => {
  try {
    const result = evaluate(expression); // Safely evaluates the expression using mathjs
    return typeof result === "number" && isFinite(result) ? result : null;
  } catch (error) {
    console.log(`error evaluation math: `, error);
    return null;
  }
};

// Main function to parse a string and convert it to a number
export const parseStringToNumber = (input: string): number | null => {
  const cleanedInput = input.trim().toLowerCase();

  // Check if the string contains only superscript characters
  if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(cleanedInput)) {
    return superscriptToNumber(cleanedInput);
  }

  // Check if the string is a Roman numeral
  if (/^[ivxlcdm]+$/.test(cleanedInput)) {
    return romanToNumber(cleanedInput);
  }

  // Check if the string is a number in words
  if (/^[a-z\s-]+$/.test(cleanedInput)) {
    return wordsToNumber(cleanedInput);
  }

  // Preprocess the string to replace superscripts before evaluating math expressions
  const inputWithSuperscriptsReplaced = replaceSuperscripts(cleanedInput);
  const evaled = safeEval(inputWithSuperscriptsReplaced);

  if (evaled) {
    return evaled;
  }

  return null; // Return null for invalid inputs
};
