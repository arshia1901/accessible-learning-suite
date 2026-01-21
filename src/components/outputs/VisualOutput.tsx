import { useMemo } from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { extractKeywords, type ExtractedKeyword } from '@/lib/keywordExtractor';
import { cn } from '@/lib/utils';

interface VisualOutputProps {
  text: string;
}

function KeywordCard({ keyword, index }: { keyword: ExtractedKeyword; index: number }) {
  const Icon = keyword.icon;
  
  return (
    <div 
      className="keyword-card animate-fade-in"
      style={{ 
        animationDelay: `${index * 100}ms`,
        borderColor: `${keyword.color}20`,
      }}
    >
      <div 
        className="p-4 rounded-xl"
        style={{ backgroundColor: `${keyword.color}15` }}
      >
        <Icon 
          className="w-8 h-8"
          style={{ color: keyword.color }}
          aria-hidden="true"
        />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground capitalize text-lg">
          {keyword.word}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${keyword.color}15`,
              color: keyword.color,
            }}
          >
            {keyword.count}x
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(keyword.importance * 100)}% relevant
          </span>
        </div>
      </div>
      {keyword.context && (
        <p className="text-xs text-muted-foreground text-center mt-2 line-clamp-2">
          "{keyword.context}"
        </p>
      )}
    </div>
  );
}

function ConceptFlow({ keywords }: { keywords: ExtractedKeyword[] }) {
  if (keywords.length < 2) return null;
  
  return (
    <div className="output-card">
      <h3 className="font-semibold text-foreground mb-4">Concept Flow</h3>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {keywords.slice(0, 5).map((keyword, index) => {
          const Icon = keyword.icon;
          return (
            <div key={keyword.word} className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: `${keyword.color}15` }}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: keyword.color }}
                  aria-hidden="true"
                />
                <span 
                  className="font-medium capitalize"
                  style={{ color: keyword.color }}
                >
                  {keyword.word}
                </span>
              </div>
              {index < Math.min(keywords.length - 1, 4) && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function VisualOutput({ text }: VisualOutputProps) {
  const result = useMemo(() => {
    return extractKeywords(text, 8);
  }, [text]);
  
  if (!text.trim()) {
    return (
      <div className="output-card flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-lg">
          Enter some text above to see visual representations.
        </p>
      </div>
    );
  }
  
  if (result.keywords.length === 0) {
    return (
      <div className="output-card flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-12 h-12 text-accent-visual/50 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-lg">
          No significant keywords found. Try adding more content.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="output-card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent-visual">
              {result.keywords.length}
            </div>
            <div className="text-sm text-muted-foreground">Key Concepts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {result.totalWords}
            </div>
            <div className="text-sm text-muted-foreground">Total Words</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {result.uniqueWords}
            </div>
            <div className="text-sm text-muted-foreground">Unique Words</div>
          </div>
        </div>
      </div>
      
      {/* Concept Flow */}
      <ConceptFlow keywords={result.keywords} />
      
      {/* Keyword Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {result.keywords.map((keyword, index) => (
          <KeywordCard key={keyword.word} keyword={keyword} index={index} />
        ))}
      </div>
      
      {/* Extraction Notes */}
      <div className="output-card bg-muted/50">
        <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          {result.extractionNotes.map((note, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-visual mt-2 flex-shrink-0" />
              {note}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Keywords are extracted using frequency analysis and mapped to relevant icons 
          for visual learning. The concept flow shows relationships between key ideas.
        </p>
      </div>
    </div>
  );
}
