
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Rabbit, Turtle, Expand, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulationControlsProps {
  isRunning: boolean;
  speed: number;
  stepCount: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  speed,
  stepCount,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const sliderValue = 100 - ((speed - 10) / (1000 - 10)) * 100;

  const handleSliderChange = (value: number[]) => {
    const newSpeed = 1000 - ((value[0] / 100) * (1000 - 10));
    onSpeedChange(newSpeed);
  };

  return (
    <div className={cn(
      "flex flex-col items-center gap-4 w-full max-w-xl mx-auto rounded-lg",
      isFullscreen
        ? "fixed bottom-0 left-1/2 -translate-x-1/2 z-[60] p-3 sm:p-4 bg-card/90 backdrop-blur-sm border shadow-xl mb-2 sm:mb-4 w-[calc(100%-1rem)] sm:w-auto" // Floating controls
        : "mt-6 p-4 border bg-card shadow-sm" // Original styling
    )}>
       <div className="text-sm text-muted-foreground"> {/* Removed mb-2 to tighten space in fullscreen */}
        Step Count: {stepCount}
      </div>
      <div className="flex flex-wrap justify-center gap-2 w-full">
        <Button onClick={isRunning ? onPause : onStart} variant="default" aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}>
          {isRunning ? <Pause /> : <Play />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={onReset} variant="outline" aria-label="Reset simulation">
          <RotateCcw />
          Reset
        </Button>
        <Button onClick={onToggleFullscreen} variant="outline" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          {isFullscreen ? <Shrink /> : <Expand />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </Button>
      </div>
      <div className="w-full max-w-xs mt-2">
        <Label htmlFor="speed-slider" className="mb-2 text-sm font-medium text-center block">Simulation Speed</Label>
        <div className="flex items-center gap-2">
            <Turtle className="text-muted-foreground" />
            <Slider
            id="speed-slider"
            min={0}
            max={100}
            step={1}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            className="w-full"
            aria-label={`Simulation speed control, current speed value ${Math.round(sliderValue)} out of 100`}
            />
            <Rabbit className="text-muted-foreground" />
        </div>
         <div className="text-xs text-muted-foreground text-center mt-1">
            {speed.toFixed(0)} ms / step
         </div>
      </div>
    </div>
  );
};

export default SimulationControls;
