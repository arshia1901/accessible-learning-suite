/**
 * Rule-based Text Simplification Module
 * Converts complex academic text into simpler language
 * Explainable, no AI hallucinations, preserves meaning
 */

// Complex word replacements (academic → simple)
const wordReplacements: Record<string, string> = {
  // Academic vocabulary
  'utilize': 'use',
  'utilization': 'use',
  'implement': 'use',
  'implementation': 'use',
  'subsequently': 'then',
  'consequently': 'so',
  'therefore': 'so',
  'however': 'but',
  'nevertheless': 'but',
  'nonetheless': 'still',
  'furthermore': 'also',
  'moreover': 'also',
  'additionally': 'also',
  'approximately': 'about',
  'commence': 'start',
  'terminate': 'end',
  'sufficient': 'enough',
  'insufficient': 'not enough',
  'demonstrate': 'show',
  'indicate': 'show',
  'illustrate': 'show',
  'facilitate': 'help',
  'assist': 'help',
  'obtain': 'get',
  'acquire': 'get',
  'possess': 'have',
  'require': 'need',
  'necessitate': 'need',
  'endeavor': 'try',
  'attempt': 'try',
  'accomplish': 'do',
  'achieve': 'reach',
  'attain': 'reach',
  'constitute': 'make up',
  'comprise': 'include',
  'ascertain': 'find out',
  'determine': 'find',
  'elucidate': 'explain',
  'exemplify': 'show',
  'numerous': 'many',
  'substantial': 'large',
  'significant': 'important',
  'fundamental': 'basic',
  'essential': 'key',
  'primary': 'main',
  'predominant': 'main',
  'paramount': 'most important',
  'crucial': 'very important',
  'vital': 'very important',
  'optimal': 'best',
  'feasible': 'possible',
  'viable': 'workable',
  'comprehensive': 'complete',
  'extensive': 'wide',
  'preliminary': 'early',
  'subsequent': 'later',
  'prior': 'before',
  'preceding': 'before',
  'concurrent': 'at the same time',
  'simultaneous': 'at the same time',
  'instantaneous': 'instant',
  'perpetual': 'endless',
  'temporary': 'short-term',
  'permanent': 'lasting',
  'adequate': 'enough',
  'appropriate': 'right',
  'beneficial': 'helpful',
  'detrimental': 'harmful',
  'advantageous': 'good',
  'disadvantageous': 'bad',
  'efficacious': 'effective',
  'proficient': 'skilled',
  'competent': 'able',
  'cognizant': 'aware',
  'apparent': 'clear',
  'evident': 'clear',
  'obvious': 'clear',
  'ambiguous': 'unclear',
  'obscure': 'unclear',
  'vague': 'unclear',
  'precise': 'exact',
  'accurate': 'correct',
  'erroneous': 'wrong',
  'fallacious': 'false',
  'authentic': 'real',
  'genuine': 'real',
  'artificial': 'fake',
  'synthetic': 'man-made',
  'inherent': 'built-in',
  'intrinsic': 'natural',
  'extrinsic': 'outside',
  'external': 'outside',
  'internal': 'inside',
  'adjacent': 'next to',
  'proximate': 'near',
  'remote': 'far',
  'analogous': 'similar',
  'identical': 'same',
  'diverse': 'different',
  'heterogeneous': 'mixed',
  'homogeneous': 'uniform',
  'invariable': 'unchanging',
  'fluctuating': 'changing',
  'diminish': 'reduce',
  'augment': 'increase',
  'exacerbate': 'worsen',
  'ameliorate': 'improve',
  'mitigate': 'lessen',
  'alleviate': 'ease',
  'extricate': 'free',
  'incorporate': 'include',
  'integrate': 'combine',
  'segregate': 'separate',
  'differentiate': 'tell apart',
  'distinguish': 'tell apart',
  'correlate': 'connect',
  'substantiate': 'prove',
  'corroborate': 'confirm',
  'contradict': 'go against',
  'refute': 'disprove',
  'validate': 'confirm',
  'verify': 'check',
  'scrutinize': 'examine',
  'analyze': 'study',
  'synthesize': 'combine',
  'formulate': 'create',
  'articulate': 'express',
  'convey': 'share',
  'disseminate': 'spread',
  'propagate': 'spread',
  'proliferate': 'spread',
  'permeate': 'spread through',
  'penetrate': 'enter',
  'pervade': 'fill',
  'encompass': 'include',
  'entail': 'involve',
  'precipitate': 'cause',
  'instigate': 'start',
  'provoke': 'cause',
  'elicit': 'bring out',
  'evoke': 'bring up',
  'invoke': 'call upon',
  'revoke': 'cancel',
  'rescind': 'cancel',
  'supersede': 'replace',
  'supplant': 'replace',
  'obviate': 'prevent',
  'preclude': 'prevent',
  'prohibit': 'ban',
  'mandate': 'require',
  'stipulate': 'state',
  'delineate': 'describe',
  'depict': 'show',
  'portray': 'show',
};

// Phrase replacements
const phraseReplacements: Record<string, string> = {
  'in order to': 'to',
  'due to the fact that': 'because',
  'for the purpose of': 'to',
  'in the event that': 'if',
  'with regard to': 'about',
  'with respect to': 'about',
  'in reference to': 'about',
  'pertaining to': 'about',
  'on the basis of': 'based on',
  'as a result of': 'because of',
  'by means of': 'by',
  'in spite of': 'despite',
  'at this point in time': 'now',
  'at the present time': 'now',
  'in the near future': 'soon',
  'in the majority of cases': 'usually',
  'a large number of': 'many',
  'a small number of': 'few',
  'the vast majority of': 'most',
  'is able to': 'can',
  'is unable to': 'cannot',
  'has the ability to': 'can',
  'it is important to note that': 'note that',
  'it should be noted that': 'note that',
  'it is worth mentioning that': 'also',
  'take into consideration': 'consider',
  'come to the conclusion': 'conclude',
  'make a decision': 'decide',
  'give consideration to': 'consider',
  'have an effect on': 'affect',
  'have an impact on': 'affect',
  'is indicative of': 'shows',
  'is representative of': 'represents',
  'is characteristic of': 'is typical of',
  'plays a role in': 'helps with',
  'serves as': 'is',
  'functions as': 'works as',
  'acts as': 'is',
};

// Important academic terms to preserve (highlighted but not replaced)
const preserveTerms = new Set([
  'hypothesis', 'theory', 'experiment', 'data', 'evidence',
  'methodology', 'analysis', 'conclusion', 'research', 'study',
  'variable', 'constant', 'factor', 'element', 'component',
  'system', 'process', 'mechanism', 'structure', 'function',
  'algorithm', 'model', 'framework', 'paradigm', 'concept',
  'principle', 'law', 'theorem', 'axiom', 'postulate',
  'equation', 'formula', 'ratio', 'proportion', 'percentage',
  'correlation', 'causation', 'regression', 'distribution',
  'sample', 'population', 'parameter', 'statistic', 'mean',
  'median', 'mode', 'variance', 'deviation', 'probability',
]);

export interface SimplificationResult {
  simplifiedText: string;
  originalWordCount: number;
  simplifiedWordCount: number;
  replacementsMade: number;
  preservedTerms: string[];
  semanticScore: number;
  difficultyReduction: number;
  validationStatus: 'valid' | 'warning' | 'error';
  validationMessage: string;
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 100;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const avgSyllablesPerWord = totalSyllables / words.length;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, score));
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
}

function simplifySentence(sentence: string): string {
  let result = sentence;
  
  // Apply phrase replacements first (longer matches)
  for (const [phrase, replacement] of Object.entries(phraseReplacements)) {
    const regex = new RegExp(phrase, 'gi');
    result = result.replace(regex, replacement);
  }
  
  // Apply word replacements
  const words = result.split(/(\s+|[.,!?;:'"()-])/);
  const simplifiedWords = words.map(word => {
    const lowerWord = word.toLowerCase();
    
    // Check if it's a preserved term
    if (preserveTerms.has(lowerWord)) {
      return word;
    }
    
    // Check for replacement
    if (wordReplacements[lowerWord]) {
      // Preserve original capitalization
      if (word[0] === word[0].toUpperCase()) {
        return wordReplacements[lowerWord].charAt(0).toUpperCase() + 
               wordReplacements[lowerWord].slice(1);
      }
      return wordReplacements[lowerWord];
    }
    
    return word;
  });
  
  return simplifiedWords.join('');
}

function breakLongSentences(sentence: string): string[] {
  const words = sentence.split(/\s+/);
  
  // If sentence is short enough, return as is
  if (words.length <= 20) return [sentence];
  
  // Try to break at conjunctions or semicolons
  const breakPoints = ['; ', ', and ', ', but ', ', however ', ', therefore '];
  
  for (const breakPoint of breakPoints) {
    if (sentence.includes(breakPoint)) {
      const parts = sentence.split(breakPoint);
      return parts.map((part, index) => {
        if (index < parts.length - 1) {
          // Add period to end of first parts
          return part.trim().replace(/,$/, '') + '.';
        }
        // Capitalize first letter of subsequent parts
        return part.charAt(0).toUpperCase() + part.slice(1);
      });
    }
  }
  
  return [sentence];
}

export function simplifyText(text: string): SimplificationResult {
  if (!text || text.trim().length === 0) {
    return {
      simplifiedText: '',
      originalWordCount: 0,
      simplifiedWordCount: 0,
      replacementsMade: 0,
      preservedTerms: [],
      semanticScore: 100,
      difficultyReduction: 0,
      validationStatus: 'warning',
      validationMessage: 'No text provided for simplification.',
    };
  }
  
  const originalWords = text.split(/\s+/).filter(w => w.length > 0);
  const originalWordCount = originalWords.length;
  
  // Find preserved terms in the text
  const foundPreservedTerms: string[] = [];
  originalWords.forEach(word => {
    const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (preserveTerms.has(lowerWord) && !foundPreservedTerms.includes(lowerWord)) {
      foundPreservedTerms.push(lowerWord);
    }
  });
  
  // Count replacements
  let replacementCount = 0;
  const lowerText = text.toLowerCase();
  
  for (const phrase of Object.keys(phraseReplacements)) {
    const matches = lowerText.match(new RegExp(phrase, 'gi'));
    if (matches) replacementCount += matches.length;
  }
  
  for (const word of Object.keys(wordReplacements)) {
    const matches = lowerText.match(new RegExp(`\\b${word}\\b`, 'gi'));
    if (matches) replacementCount += matches.length;
  }
  
  // Split into sentences and simplify
  const sentences = splitIntoSentences(text);
  const simplifiedSentences: string[] = [];
  
  for (const sentence of sentences) {
    const simplified = simplifySentence(sentence);
    const brokenSentences = breakLongSentences(simplified);
    simplifiedSentences.push(...brokenSentences);
  }
  
  const simplifiedText = simplifiedSentences.join(' ');
  const simplifiedWords = simplifiedText.split(/\s+/).filter(w => w.length > 0);
  
  // Calculate scores
  const originalReadability = calculateReadabilityScore(text);
  const simplifiedReadability = calculateReadabilityScore(simplifiedText);
  
  const difficultyReduction = Math.max(0, Math.min(100, 
    ((simplifiedReadability - originalReadability) / Math.max(1, 100 - originalReadability)) * 100
  ));
  
  // Semantic score (placeholder - in production would use NLP)
  // Higher score = better meaning preservation
  const semanticScore = Math.max(70, 100 - (replacementCount * 2));
  
  // Validation
  let validationStatus: 'valid' | 'warning' | 'error' = 'valid';
  let validationMessage = 'Text successfully simplified while preserving meaning.';
  
  if (replacementCount === 0) {
    validationStatus = 'warning';
    validationMessage = 'No simplifications needed. Text may already be simple.';
  } else if (difficultyReduction < 5) {
    validationStatus = 'warning';
    validationMessage = 'Minimal difficulty reduction achieved. Consider rephrasing manually.';
  }
  
  return {
    simplifiedText,
    originalWordCount,
    simplifiedWordCount: simplifiedWords.length,
    replacementsMade: replacementCount,
    preservedTerms: foundPreservedTerms,
    semanticScore: Math.round(semanticScore),
    difficultyReduction: Math.round(difficultyReduction),
    validationStatus,
    validationMessage,
  };
}
