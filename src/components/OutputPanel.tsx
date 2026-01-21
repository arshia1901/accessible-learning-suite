import { FormatType } from './FormatTabs';
import { SimplifiedTextOutput } from './outputs/SimplifiedTextOutput';
import { AudioOutput } from './outputs/AudioOutput';
import { VisualOutput } from './outputs/VisualOutput';
import { BrailleOutput } from './outputs/BrailleOutput';

interface OutputPanelProps {
  activeFormat: FormatType;
  text: string;
}

export function OutputPanel({ activeFormat, text }: OutputPanelProps) {
  const panels: Record<FormatType, React.ReactNode> = {
    simplified: <SimplifiedTextOutput text={text} />,
    audio: <AudioOutput text={text} />,
    visual: <VisualOutput text={text} />,
    braille: <BrailleOutput text={text} />,
  };
  
  return (
    <section 
      aria-labelledby={`${activeFormat}-tab`}
      id={`${activeFormat}-panel`}
      role="tabpanel"
      className="w-full"
    >
      {panels[activeFormat]}
    </section>
  );
}
