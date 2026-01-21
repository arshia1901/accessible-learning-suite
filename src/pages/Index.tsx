import { useState } from 'react';
import { Header } from '@/components/Header';
import { TextInput } from '@/components/TextInput';
import { FormatTabs, FormatType } from '@/components/FormatTabs';
import { OutputPanel } from '@/components/OutputPanel';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [activeFormat, setActiveFormat] = useState<FormatType>('simplified');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          {/* Input Section */}
          <TextInput value={inputText} onChange={setInputText} />
          
          {/* Format Selection */}
          <FormatTabs 
            activeFormat={activeFormat} 
            onFormatChange={setActiveFormat} 
          />
          
          {/* Output Section */}
          <OutputPanel activeFormat={activeFormat} text={inputText} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Accessible Learning Converter — Making education accessible for everyone
            </p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-muted rounded-full">
                WCAG 2.1 Compliant
              </span>
              <span className="px-3 py-1 bg-muted rounded-full">
                No Data Collection
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
