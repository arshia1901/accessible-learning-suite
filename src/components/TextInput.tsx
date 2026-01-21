import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const sampleText = `The implementation of comprehensive educational methodologies necessitates the utilization of diverse pedagogical approaches that facilitate the acquisition of knowledge and skills. Subsequently, educators must endeavor to accommodate various learning styles and cognitive abilities to ensure that all students can achieve their academic objectives. Furthermore, the integration of technology in educational settings has demonstrated significant potential for enhancing engagement and improving learning outcomes.`;

export function TextInput({ value, onChange, maxLength = 5000 }: TextInputProps) {
  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);
  
  const handleLoadSample = useCallback(() => {
    onChange(sampleText);
  }, [onChange]);
  
  return (
    <section className="w-full" aria-labelledby="input-heading">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="input-heading" className="text-lg font-semibold text-foreground">
            Enter Your Text
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadSample}
              className="text-muted-foreground"
            >
              <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
              Load Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!value}
              className="text-muted-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste or type your text here. Complex academic text works best for demonstrating the simplification features..."
            className="min-h-[200px] text-base leading-relaxed resize-y p-4 rounded-xl"
            maxLength={maxLength}
            aria-describedby="char-count"
          />
        </div>
        
        <div 
          id="char-count" 
          className="flex justify-between text-sm text-muted-foreground"
          aria-live="polite"
        >
          <span>{wordCount} words</span>
          <span>
            {characterCount.toLocaleString()} / {maxLength.toLocaleString()} characters
          </span>
        </div>
      </div>
    </section>
  );
}
