
"use client"; // Required because we use hooks (useState, useEffect, useCallback)

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
  } = useLangtonAnt(50); // Initialize with a 50x50 grid

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
    // Cleanup function to remove the class if the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFullscreen]);

  return (
    <main className={cn(
      "flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-secondary/50",
      // isFullscreen && "p-0 md:p-0" // Main padding handled by body overflow and fixed elements
    )}>
        <div className={cn(isFullscreen && "hidden")}>
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">Resonance</h1>
            <p className="text-muted-foreground mb-8 text-center max-w-prose">
                a project that showcases the art behind turing machines through Langton's ant.
            </p>
        </div>
        
        <Card className={cn(
            "w-full max-w-max", 
            isFullscreen ? "border-none shadow-none bg-transparent" : "shadow-lg"
        )}>
            <CardContent className={cn(
                "p-4 md:p-6",
                isFullscreen && "p-0" // No padding for card content when fullscreen as grid and controls are fixed
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
