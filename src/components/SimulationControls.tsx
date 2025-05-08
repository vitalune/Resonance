
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Rabbit, Turtle, Expand, Shrink, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulationControlsProps {
  isRunning: boolean;
  speed: number; // Current speed in ms
  stepCount: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MIN_ANT_SPEED = 1; // Corresponds to fastest (e.g., 1ms)
const MAX_ANT_SPEED = 1000; // Corresponds to slowest (e.g., 1000ms)

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
  // Slider value: 0 = slowest (MAX_ANT_SPEED), 100 = fastest (MIN_ANT_SPEED)
  const sliderValue = ((MAX_ANT_SPEED - speed) / (MAX_ANT_SPEED - MIN_ANT_SPEED)) * 100;
  const [controlsVisible, setControlsVisible] = React.useState(true);

  const handleSliderChange = (value: number[]) => {
    // Convert slider value (0-100) back to speed (MAX_ANT_SPEED - MIN_ANT_SPEED ms)
    const newSpeed = MAX_ANT_SPEED - ((value[0] / 100) * (MAX_ANT_SPEED - MIN_ANT_SPEED));
    onSpeedChange(Math.max(MIN_ANT_SPEED, Math.min(newSpeed, MAX_ANT_SPEED))); // Ensure speed is within bounds
  };

  const toggleControlsVisibility = () => {
    setControlsVisible(prev => !prev);
  };

  // Reset controlsVisible to true when exiting fullscreen
  React.useEffect(() => {
    if (!isFullscreen) {
      setControlsVisible(true);
    }
  }, [isFullscreen]);

  return (
    <div className={cn(
      "flex flex-col items-center gap-4 w-full max-w-xl mx-auto rounded-lg",
      isFullscreen
        ? "fixed bottom-0 left-1/2 -translate-x-1/2 z-[60] p-3 sm:p-4 bg-card/90 backdrop-blur-sm border shadow-xl mb-2 sm:mb-4 w-[calc(100%-1rem)] sm:w-auto"
        : "mt-6 p-4 border bg-card shadow-sm"
    )}>
       {/* Step Count and Speed Slider: visible when !isFullscreen OR (isFullscreen && controlsVisible) */}
       {(controlsVisible || !isFullscreen) && (
        <>
          <div className="text-sm text-muted-foreground">
            Step Count: {stepCount}
          </div>
          <div className="w-full max-w-xs mt-2">
            <Label htmlFor="speed-slider" className="mb-2 text-sm font-medium text-center block">Simulation Speed</Label>
            <div className="flex items-center gap-2">
                <Turtle className="text-muted-foreground" />
                <Slider
                id="speed-slider"
                min={0} // Represents slowest
                max={100} // Represents fastest
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
        </>
       )}

      {/* Buttons Container */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {/* Play/Pause and Reset buttons: visible when !isFullscreen OR (isFullscreen && controlsVisible) */}
        {(controlsVisible || !isFullscreen) && (
            <>
                <Button onClick={isRunning ? onPause : onStart} variant="default" aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}>
                {isRunning ? <Pause /> : <Play />}
                {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={onReset} variant="outline" aria-label="Reset simulation">
                <RotateCcw />
                Reset
                </Button>
            </>
        )}

        {/* Toggle Fullscreen button: always visible */}
        <Button onClick={onToggleFullscreen} variant="outline" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
          {isFullscreen ? <Shrink /> : <Expand />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </Button>

        {/* Hide/Show Controls button: visible only when isFullscreen */}
        {isFullscreen && (
          <Button 
            onClick={toggleControlsVisibility} 
            variant="outline" 
            aria-label={controlsVisible ? "Hide simulation controls" : "Show simulation controls"}
          >
            {controlsVisible ? <EyeOff /> : <Eye />}
            {controlsVisible ? 'Hide Controls' : 'Show Controls'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SimulationControls;
