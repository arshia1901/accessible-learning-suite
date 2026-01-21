/**
 * Text to Braille Converter
 * Converts text to Unicode Braille patterns
 * Based on Grade 1 Braille (letter-by-letter)
 */

// Braille patterns for letters (Unicode)
const brailleAlphabet: Record<string, string> = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
  'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
  'z': '⠵',
};

// Braille patterns for numbers (preceded by number indicator ⠼)
const brailleNumbers: Record<string, string> = {
  '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙',
  '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊',
};

// Braille patterns for punctuation
const braillePunctuation: Record<string, string> = {
  ' ': '⠀', // Braille space
  '.': '⠲',
  ',': '⠂',
  '?': '⠦',
  '!': '⠖',
  ';': '⠆',
  ':': '⠒',
  "'": '⠄',
  '"': '⠐⠦', // Opening quote
  '-': '⠤',
  '(': '⠐⠣',
  ')': '⠐⠜',
  '/': '⠌',
  '@': '⠈⠁',
  '#': '⠼',
  '&': '⠈⠯',
  '*': '⠐⠔',
  '+': '⠐⠖',
  '=': '⠐⠶',
  '<': '⠐⠣',
  '>': '⠐⠜',
  '$': '⠈⠎',
  '%': '⠨⠴',
  '_': '⠸',
};

// Special indicators
const CAPITAL_INDICATOR = '⠠'; // Indicates next letter is capital
const NUMBER_INDICATOR = '⠼'; // Indicates following are numbers
const LETTER_INDICATOR = '⠰'; // Returns to letter mode after numbers

export interface BrailleResult {
  brailleText: string;
  characterCount: number;
  wordCount: number;
  conversionNotes: string[];
}

export function convertToBraille(text: string): BrailleResult {
  if (!text || text.trim().length === 0) {
    return {
      brailleText: '',
      characterCount: 0,
      wordCount: 0,
      conversionNotes: ['No text provided for conversion.'],
    };
  }
  
  const notes: string[] = [];
  let result = '';
  let inNumberMode = false;
  let unconvertedChars = new Set<string>();
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();
    
    // Handle whitespace
    if (char === ' ' || char === '\t') {
      result += '⠀'; // Braille space
      inNumberMode = false;
      continue;
    }
    
    // Handle newlines
    if (char === '\n') {
      result += '\n';
      inNumberMode = false;
      continue;
    }
    
    // Handle numbers
    if (/[0-9]/.test(char)) {
      if (!inNumberMode) {
        result += NUMBER_INDICATOR;
        inNumberMode = true;
      }
      result += brailleNumbers[char];
      continue;
    }
    
    // Exit number mode for letters
    if (inNumberMode && /[a-zA-Z]/.test(char)) {
      result += LETTER_INDICATOR;
      inNumberMode = false;
    }
    
    // Handle uppercase letters
    if (/[A-Z]/.test(char)) {
      result += CAPITAL_INDICATOR;
      result += brailleAlphabet[lowerChar] || '';
      inNumberMode = false;
      continue;
    }
    
    // Handle lowercase letters
    if (/[a-z]/.test(char)) {
      result += brailleAlphabet[char] || '';
      inNumberMode = false;
      continue;
    }
    
    // Handle punctuation
    if (braillePunctuation[char]) {
      result += braillePunctuation[char];
      inNumberMode = false;
      continue;
    }
    
    // Track unconverted characters
    unconvertedChars.add(char);
  }
  
  // Generate notes
  if (unconvertedChars.size > 0) {
    notes.push(`Some characters could not be converted: ${[...unconvertedChars].join(', ')}`);
  }
  
  notes.push('Using Grade 1 (Uncontracted) Braille for accuracy.');
  notes.push('Capital letters are marked with ⠠ prefix.');
  notes.push('Numbers are marked with ⠼ prefix.');
  
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  
  return {
    brailleText: result,
    characterCount: text.length,
    wordCount,
    conversionNotes: notes,
  };
}

// Get Braille representation of a single character (for display)
export function getBrailleChar(char: string): string {
  const lower = char.toLowerCase();
  
  if (/[a-z]/.test(lower)) {
    return brailleAlphabet[lower] || char;
  }
  
  if (/[0-9]/.test(char)) {
    return brailleNumbers[char] || char;
  }
  
  return braillePunctuation[char] || char;
}
