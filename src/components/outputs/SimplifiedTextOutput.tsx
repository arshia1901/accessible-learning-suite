import { useMemo } from 'react';
import { CheckCircle, AlertCircle, Info, ArrowDown, Bookmark, Copy, Check } from 'lucide-react';
import { simplifyText, type SimplificationResult } from '@/lib/textSimplifier';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SimplifiedTextOutputProps {
  text: string;
}

function ScoreBadge({ 
  label, 
  value, 
  suffix = '%',
  variant = 'default' 
}: { 
  label: string; 
  value: number; 
  suffix?: string;
  variant?: 'default' | 'success' | 'warning';
}) {
  return (
    <div className={cn(
      'score-badge',
      variant === 'success' && 'bg-success/10 text-success',
      variant === 'warning' && 'bg-accent-visual/10 text-accent-visual',
      variant === 'default' && 'bg-primary/10 text-primary'
    )}>
      <span className="font-semibold">{value}{suffix}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function SimplifiedTextOutput({ text }: SimplifiedTextOutputProps) {
  const [copied, setCopied] = useState(false);
  
  const result: SimplificationResult = useMemo(() => {
    return simplifyText(text);
  }, [text]);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.simplifiedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!text.trim()) {
    return (
      <div className="output-card flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-lg">
          Enter some text above to see the simplified version.
        </p>
      </div>
    );
  }
  
  const StatusIcon = result.validationStatus === 'valid' ? CheckCircle : 
                     result.validationStatus === 'warning' ? AlertCircle : AlertCircle;
  const statusColor = result.validationStatus === 'valid' ? 'text-success' :
                      result.validationStatus === 'warning' ? 'text-accent-visual' : 'text-destructive';
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status and Scores */}
      <div className="output-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('w-5 h-5', statusColor)} aria-hidden="true" />
            <span className={cn('font-medium', statusColor)}>
              {result.validationMessage}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!result.simplifiedText}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                Copy Text
              </>
            )}
          </Button>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground">
              {result.originalWordCount}
            </div>
            <div className="text-sm text-muted-foreground">Original Words</div>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <div className="text-2xl font-bold text-foreground">
              {result.simplifiedWordCount}
            </div>
            <div className="text-sm text-muted-foreground">Simplified Words</div>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <div className="text-2xl font-bold text-accent-simplify">
              {result.replacementsMade}
            </div>
            <div className="text-sm text-muted-foreground">Replacements</div>
          </div>
          <div className="p-4 bg-muted rounded-xl text-center">
            <div className="text-2xl font-bold text-success">
              {result.difficultyReduction}%
            </div>
            <div className="text-sm text-muted-foreground">Easier to Read</div>
          </div>
        </div>
        
        {/* Score Badges */}
        <div className="flex flex-wrap gap-3">
          <ScoreBadge 
            label="Semantic Preservation" 
            value={result.semanticScore} 
            variant="success"
          />
          <ScoreBadge 
            label="Difficulty Reduction" 
            value={result.difficultyReduction} 
            variant="default"
          />
        </div>
      </div>
      
      {/* Preserved Terms */}
      {result.preservedTerms.length > 0 && (
        <div className="output-card">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Preserved Academic Terms</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.preservedTerms.map((term) => (
              <span 
                key={term}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Comparison View */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original Text */}
        <div className="output-card">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" aria-hidden="true" />
            Original Text
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {text}
          </p>
        </div>
        
        {/* Simplified Text */}
        <div className="output-card border-primary/20 bg-primary/[0.02]">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-simplify" aria-hidden="true" />
            Simplified Text
          </h3>
          <p className="text-foreground leading-relaxed">
            {result.simplifiedText}
          </p>
        </div>
      </div>
      
      {/* Arrow indicator */}
      <div className="flex justify-center">
        <div className="p-2 bg-muted rounded-full">
          <ArrowDown className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
      
      {/* Explanation */}
      <div className="output-card bg-muted/50">
        <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This module uses rule-based text simplification with no AI hallucinations. 
          It replaces complex academic vocabulary with simpler alternatives, breaks long 
          sentences into shorter ones, and preserves important academic terms that should 
          remain unchanged for accuracy.
        </p>
      </div>
    </div>
  );
}
