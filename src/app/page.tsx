
"use client"; // Required because we use hooks (useState, useEffect)

import LangtonGrid from '@/components/LangtonGrid';
import SimulationControls from '@/components/SimulationControls';
import { useLangtonAnt } from '@/hooks/useLangtonAnt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-secondary/50">
        <h1 className="text-4xl font-bold mb-6 text-center text-primary">Resonance</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-prose">
            a project that showcases the art behind turing machines through Langton's ant.
        </p>
        <Card className="w-full max-w-max shadow-lg">

        <CardContent className="p-4 md:p-6">
          <LangtonGrid grid={grid} antPosition={antPosition} antDirection={antDirection} />
          <SimulationControls
            isRunning={isRunning}
            speed={speed}
            stepCount={stepCount}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSpeedChange={changeSpeed}
          />
        </CardContent>
      </Card>
    </main>
  );
}
