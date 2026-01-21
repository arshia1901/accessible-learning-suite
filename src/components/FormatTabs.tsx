import { FileText, Volume2, Image, Braces } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FormatType = 'simplified' | 'audio' | 'visual' | 'braille';

interface FormatTabsProps {
  activeFormat: FormatType;
  onFormatChange: (format: FormatType) => void;
}

const formats: Array<{
  id: FormatType;
  label: string;
  description: string;
  icon: typeof FileText;
  colorClass: string;
}> = [
  {
    id: 'simplified',
    label: 'Simplified Text',
    description: 'Cognitive accessibility',
    icon: FileText,
    colorClass: 'text-accent-simplify',
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'Text-to-Speech',
    icon: Volume2,
    colorClass: 'text-accent-audio',
  },
  {
    id: 'visual',
    label: 'Visual',
    description: 'Icons & cards',
    icon: Image,
    colorClass: 'text-accent-visual',
  },
  {
    id: 'braille',
    label: 'Braille',
    description: 'Unicode Braille',
    icon: Braces,
    colorClass: 'text-accent-braille',
  },
];

export function FormatTabs({ activeFormat, onFormatChange }: FormatTabsProps) {
  return (
    <section aria-labelledby="format-heading" className="w-full">
      <h2 id="format-heading" className="sr-only">
        Select Output Format
      </h2>
      
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        role="tablist"
        aria-label="Output format options"
      >
        {formats.map((format) => {
          const Icon = format.icon;
          const isActive = activeFormat === format.id;
          
          return (
            <button
              key={format.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${format.id}-panel`}
              id={`${format.id}-tab`}
              onClick={() => onFormatChange(format.id)}
              className={cn(
                'format-tab bg-card',
                isActive && 'border-primary bg-primary/5',
                !isActive && 'hover:bg-muted/50'
              )}
            >
              <div className={cn(
                'p-3 rounded-lg transition-colors',
                isActive ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Icon 
                  className={cn(
                    'w-6 h-6',
                    isActive ? format.colorClass : 'text-muted-foreground'
                  )} 
                  aria-hidden="true" 
                />
              </div>
              <div className="flex flex-col items-center">
                <span className={cn(
                  'font-medium text-sm md:text-base',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {format.label}
                </span>
                <span className="text-xs text-muted-foreground hidden md:block">
                  {format.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
