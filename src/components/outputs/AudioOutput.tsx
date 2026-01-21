import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Info, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioOutputProps {
  text: string;
}

export function AudioOutput({ text }: AudioOutputProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);
  
  // Check for speech synthesis support
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  const handlePlay = () => {
    if (!isSpeechSupported) {
      setError('Text-to-speech is not supported in your browser.');
      return;
    }
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    
    // Cancel any existing speech
    window.speechSynthesis.cancel();
    
    setIsLoading(true);
    setError(null);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : volume;
    
    // Try to get a good voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setProgress(0);
      
      // Simulate progress (speech synthesis doesn't provide real progress)
      const estimatedDuration = text.length * 60; // Rough estimate
      let elapsed = 0;
      intervalRef.current = window.setInterval(() => {
        elapsed += 100;
        setProgress(Math.min((elapsed / estimatedDuration) * 100, 99));
      }, 100);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimeout(() => setProgress(0), 1000);
    };
    
    utterance.onerror = (event) => {
      setIsLoading(false);
      setIsPlaying(false);
      setError(`Speech synthesis error: ${event.error}`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };
  
  if (!text.trim()) {
    return (
      <div className="output-card flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-lg">
          Enter some text above to generate audio.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Audio Player */}
      <div className="output-card">
        <div className="flex flex-col items-center gap-6">
          {/* Waveform Visualization (placeholder) */}
          <div className="w-full h-24 bg-muted rounded-xl flex items-center justify-center overflow-hidden relative">
            {/* Progress bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-accent-audio/20 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            
            {/* Waveform bars */}
            <div className="flex items-center gap-1 relative z-10">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 rounded-full transition-all duration-150',
                    isPlaying ? 'bg-accent-audio' : 'bg-muted-foreground/30'
                  )}
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 15 + (isPlaying ? Math.random() * 20 : 0)}px`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={isLoading}
              className="w-16 h-16 rounded-full bg-accent-audio hover:bg-accent-audio/90"
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8" aria-hidden="true" />
              ) : (
                <Play className="w-8 h-8 ml-1" aria-hidden="true" />
              )}
              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5 text-foreground" aria-hidden="true" />
              )}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="flex-1"
              aria-label="Volume"
            />
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Info Card */}
      <div className="output-card bg-muted/50">
        <h3 className="font-semibold text-foreground mb-2">About Audio Generation</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This uses your browser's built-in text-to-speech engine. For production use, 
          you could integrate with cloud TTS services like ElevenLabs or Google Cloud 
          Text-to-Speech for higher quality voices and more customization options.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-accent-audio/10 text-accent-audio rounded-full text-sm">
            Browser TTS
          </span>
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            No API Required
          </span>
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            Works Offline
          </span>
        </div>
      </div>
      
      {/* Text Preview */}
      <div className="output-card">
        <h3 className="font-semibold text-foreground mb-3">Text Being Read</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {text}
        </p>
      </div>
    </div>
  );
}
