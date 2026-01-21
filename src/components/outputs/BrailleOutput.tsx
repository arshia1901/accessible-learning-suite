import { useMemo, useState } from 'react';
import { Info, Copy, Check, HelpCircle } from 'lucide-react';
import { convertToBraille, getBrailleChar } from '@/lib/brailleConverter';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BrailleOutputProps {
  text: string;
}

function BrailleLegend() {
  const examples = [
    { char: 'A', braille: '⠁' },
    { char: 'B', braille: '⠃' },
    { char: 'C', braille: '⠉' },
    { char: '1', braille: '⠼⠁' },
    { char: '2', braille: '⠼⠃' },
    { char: '.', braille: '⠲' },
    { char: ',', braille: '⠂' },
    { char: '?', braille: '⠦' },
  ];
  
  return (
    <div className="output-card">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-accent-braille" aria-hidden="true" />
        <h3 className="font-semibold text-foreground">Braille Reference</h3>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {examples.map(({ char, braille }) => (
          <div 
            key={char}
            className="flex flex-col items-center p-3 bg-muted rounded-lg"
          >
            <span className="font-braille text-2xl text-foreground">{braille}</span>
            <span className="text-sm text-muted-foreground mt-1">{char}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="px-3 py-1 bg-accent-braille/10 text-accent-braille rounded-full">
          ⠠ = Capital
        </span>
        <span className="px-3 py-1 bg-accent-braille/10 text-accent-braille rounded-full">
          ⠼ = Number
        </span>
        <span className="px-3 py-1 bg-accent-braille/10 text-accent-braille rounded-full">
          ⠀ = Space
        </span>
      </div>
    </div>
  );
}

function InteractiveBraille({ text }: { text: string }) {
  const chars = text.slice(0, 50).split('');
  
  return (
    <div className="output-card">
      <h3 className="font-semibold text-foreground mb-4">Interactive View (First 50 characters)</h3>
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          {chars.map((char, index) => {
            const braille = getBrailleChar(char);
            const isLetter = /[a-zA-Z]/.test(char);
            const isNumber = /[0-9]/.test(char);
            const isSpace = char === ' ';
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    className={`
                      p-2 rounded-lg border transition-colors
                      ${isSpace ? 'bg-muted border-muted' : 'bg-card hover:bg-muted border-border'}
                    `}
                  >
                    <div className="flex flex-col items-center min-w-[28px]">
                      <span className="font-braille text-xl text-foreground">
                        {isSpace ? '⠀' : braille}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {isSpace ? '␣' : char}
                      </span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <strong>"{char === ' ' ? 'space' : char}"</strong>
                    {isLetter && ' (letter)'}
                    {isNumber && ' (number)'}
                    {isSpace && ' (space)'}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      {text.length > 50 && (
        <p className="text-sm text-muted-foreground mt-3">
          Showing first 50 characters. See full conversion below.
        </p>
      )}
    </div>
  );
}

export function BrailleOutput({ text }: BrailleOutputProps) {
  const [copied, setCopied] = useState(false);
  
  const result = useMemo(() => {
    return convertToBraille(text);
  }, [text]);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.brailleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!text.trim()) {
    return (
      <div className="output-card flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-lg">
          Enter some text above to see Braille representation.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="output-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-accent-braille">
                {result.characterCount}
              </div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {result.wordCount}
              </div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                Copy Braille
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Interactive Braille */}
      <InteractiveBraille text={text} />
      
      {/* Full Braille Output */}
      <div className="output-card">
        <h3 className="font-semibold text-foreground mb-4">Full Braille Conversion</h3>
        <div 
          className="braille-display overflow-x-auto"
          aria-label="Braille text output"
        >
          {result.brailleText}
        </div>
      </div>
      
      {/* Original Text */}
      <div className="output-card">
        <h3 className="font-semibold text-foreground mb-3">Original Text</h3>
        <p className="text-muted-foreground leading-relaxed">
          {text}
        </p>
      </div>
      
      {/* Braille Legend */}
      <BrailleLegend />
      
      {/* Conversion Notes */}
      <div className="output-card bg-muted/50">
        <h3 className="font-semibold text-foreground mb-2">Conversion Notes</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          {result.conversionNotes.map((note, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-braille mt-2 flex-shrink-0" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
