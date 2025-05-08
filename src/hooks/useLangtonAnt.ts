"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 50; // Default grid size
const MIN_SPEED_MS = 1; // Minimum milliseconds between steps (fastest)
const MAX_SPEED_MS = 1000; // Maximum milliseconds between steps (slowest)
const INITIAL_SPEED = 100; // Milliseconds between steps

// Directions: 0: up, 1: right, 2: down, 3: left
const directions = [
  { dx: 0, dy: -1 }, // up
  { dx: 1, dy: 0 },  // right
  { dx: 0, dy: 1 },  // down
  { dx: -1, dy: 0 }, // left
];

// Grid cell states:
// 0: Background (e.g., 'white' in classic Langton, dark gray here)
// 1: Trail of Ant 1 (e.g., 'black' in classic Langton, white here)
// 2: Trail of Ant 2 (e.g., yellow here)

interface AntRule {
  conditionColor: number; // Color on the grid the ant encounters
  turnDirection: 'L' | 'R'; // Turn Left or Right
  paintColor: number; // Color to paint on the grid cell
}

interface AntConfig {
  id: string;
  initialX: (gridSize: number) => number;
  initialY: (gridSize: number) => number;
  initialDirection: number;
  rules: AntRule[];
  bodyColor: string; // CSS color for the ant's body
}

const antConfigs: AntConfig[] = [
  {
    id: 'ant1',
    initialX: (size) => Math.floor(size * 0.75),
    initialY: (size) => Math.floor(size * 0.75),
    initialDirection: 0, // Up
    rules: [
      { conditionColor: 0, turnDirection: 'R', paintColor: 1 }, // On background (0), paint Ant1-trail (1), turn R
      { conditionColor: 1, turnDirection: 'L', paintColor: 0 }, // On Ant1-trail (1), paint background (0), turn L
      { conditionColor: 2, turnDirection: 'L', paintColor: 0 }, // On Ant2-trail (2), paint background (0), turn L
    ],
    bodyColor: '#FF4500', // Red
  },
  {
    id: 'ant2',
    initialX: (size) => Math.floor(size * 0.25),
    initialY: (size) => Math.floor(size * 0.25),
    initialDirection: 2, // Down
    rules: [
      { conditionColor: 0, turnDirection: 'R', paintColor: 2 }, // On background (0), paint Ant2-trail (2), turn R
      { conditionColor: 1, turnDirection: 'R', paintColor: 0 }, // On Ant1-trail (1), paint background (0), turn R (different interaction)
      { conditionColor: 2, turnDirection: 'L', paintColor: 0 }, // On Ant2-trail (2), paint background (0), turn L
    ],
    bodyColor: '#00BCD4', // Cyan/Teal
  },
];

interface AntState {
  id: string;
  x: number;
  y: number;
  direction: number;
  config: AntConfig;
}

// Function to create an initial empty grid
const createInitialGrid = (size: number): number[][] => {
  return Array(size).fill(0).map(() => Array(size).fill(0)); // 0 represents background
};

const initializeAnts = (gridSize: number): AntState[] => {
  return antConfigs.map(config => ({
    id: config.id,
    x: config.initialX(gridSize),
    y: config.initialY(gridSize),
    direction: config.initialDirection,
    config: config,
  }));
};

export const useLangtonAnt = (gridSize = GRID_SIZE) => {
  const [grid, setGrid] = useState(() => createInitialGrid(gridSize));
  const [ants, setAnts] = useState<AntState[]>(() => initializeAnts(gridSize));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [stepCount, setStepCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const step = useCallback(() => {
    setGrid((prevGrid) => {
      const nextGridSnapshot = prevGrid.map(row => [...row]); // Mutable copy for current step's writes
      
      const updatedAnts = ants.map(antInstance => {
        const { x, y, direction, config } = antInstance;
        
        // Ants read from the grid state as it was at the beginning of this step
        const currentCellColorOnPrevGrid = prevGrid[y][x];
        
        const rule = config.rules.find(r => r.conditionColor === currentCellColorOnPrevGrid);
        
        let nextDirection = direction;
        
        if (rule) {
          nextDirection = (direction + (rule.turnDirection === 'R' ? 1 : 3)) % 4;
          // Apply paint to the grid copy. If multiple ants paint the same cell, the last one in the `ants` array wins for this step.
          nextGridSnapshot[y][x] = rule.paintColor;
        } else {
          // Fallback: if an ant encounters a color for which it has no explicit rule.
          // This shouldn't happen if rules are comprehensive for all possible grid colors (0, 1, 2).
          // For safety, it could just move straight without painting or log a warning.
          console.warn(`Ant ${config.id} encountered unhandled cell color ${currentCellColorOnPrevGrid} at (${x},${y}). Moving straight.`);
        }

        const { dx, dy } = directions[nextDirection];
        const nextX = (x + dx + gridSize) % gridSize; // Wrap around
        const nextY = (y + dy + gridSize) % gridSize; // Wrap around
        
        return { ...antInstance, x: nextX, y: nextY, direction: nextDirection };
      });
      
      setAnts(updatedAnts); // Update all ants' positions/directions
      setStepCount((c) => c + 1);
      return nextGridSnapshot; // Return the modified grid
    });
  }, [ants, gridSize]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, step]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setGrid(createInitialGrid(gridSize));
    setAnts(initializeAnts(gridSize));
    setStepCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const changeSpeed = (newSpeed: number) => {
    const clampedSpeed = Math.max(MIN_SPEED_MS, Math.min(newSpeed, MAX_SPEED_MS));
    setSpeed(clampedSpeed);
  };

  // Expose ants data needed for rendering
  const antsForRender = ants.map(a => ({
    id: a.id,
    x: a.x,
    y: a.y,
    direction: a.direction,
    color: a.config.bodyColor, // The ant's own body color
  }));

  return {
    grid,
    ants: antsForRender, // pass this to LangtonGrid
    isRunning,
    speed,
    stepCount,
    start,
    pause,
    reset,
    changeSpeed,
    step,
  };
};
