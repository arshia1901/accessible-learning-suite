import { Accessibility } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Accessibility className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Accessible Learning Converter
            </h1>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            One input. Multiple accessible formats.
          </p>
        </div>
      </div>
    </header>
  );
}
