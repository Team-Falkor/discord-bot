const romanToNumMap: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

const wordsToNumMap: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

// Converts a Roman numeral string to a number
const romanToNumber = (roman: string): number => {
  let total = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanToNumMap[roman[i].toUpperCase()];
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
    const value = wordsToNumMap[word];
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

// Main function to parse a string and convert it to a number
export const parseStringToNumber = (input: string): number | null => {
  const cleanedInput = input.trim().toLowerCase();

  // Check if the string is a Roman numeral
  if (/^[ivxlcdm]+$/i.test(cleanedInput)) return romanToNumber(cleanedInput);

  // Check if the string is a number in words
  if (/^[a-z\s-]+$/i.test(cleanedInput)) return wordsToNumber(cleanedInput);

  return null; // Return null for invalid inputs
};
