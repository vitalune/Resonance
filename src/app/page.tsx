
"use client"; 

import LangtonGrid from '@/components/LangtonGrid';
import SimulationControls from '@/components/SimulationControls';
import { useLangtonAnt } from '@/hooks/useLangtonAnt';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    grid,
    antPosition,
    antDirection,
    isRunning,
    speed,
    stepCount,
    start,
    pause,
    reset,
    changeSpeed,
  } = useLangtonAnt(50); 

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFullscreen]);

  return (
    <main className={cn(
      "flex min-h-screen flex-col items-center p-6 md:p-12",
      // Adjust vertical alignment based on fullscreen: center when fullscreen, more top-aligned otherwise
      isFullscreen ? "justify-center" : "justify-start pt-16 md:pt-24 lg:pt-32" 
    )}>
        {/* Title and Description Area - Displayed on the main gradient background */}
        <div className={cn(
          "text-center mb-8 md:mb-12 lg:mb-16",
          isFullscreen && "hidden" // Hide title and description in fullscreen mode
        )}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground [text-shadow:_0_1px_3px_hsl(0_0%_0%_/_0.5)]">
              Resonance
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-prose mx-auto [text-shadow:_0_1px_2px_hsl(0_0%_0%_/_0.4)]">
                A project that showcases the art behind Turing machines through Langton's ant.
            </p>
        </div>
        
        {/* Simulation Area - Contained within a Card component */}
        <Card className={cn(
            "w-full max-w-max bg-card text-card-foreground", // Uses theme variables for black card and light text
            isFullscreen 
              ? "border-none shadow-none !bg-transparent fixed inset-0 z-40 flex flex-col items-center justify-center" // Fullscreen: transparent card bg, takes full screen
              : "shadow-2xl rounded-xl border-border/70" // Normal view: prominent shadow, rounded corners, subtle border
        )}>
            <CardContent className={cn(
                "p-3 sm:p-4 md:p-6 flex flex-col items-center", // Ensure CardContent centers children
                isFullscreen ? "p-0 w-full h-full flex flex-col items-center justify-center" : "" // Fullscreen CardContent adjustments
            )}>
                <LangtonGrid 
                    grid={grid} 
                    antPosition={antPosition} 
                    antDirection={antDirection} 
                    isFullscreen={isFullscreen}
                />
                <SimulationControls
                    isRunning={isRunning}
                    speed={speed}
                    stepCount={stepCount}
                    onStart={start}
                    onPause={pause}
                    onReset={reset}
                    onSpeedChange={changeSpeed}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            </CardContent>
        </Card>
    </main>
  );
}
