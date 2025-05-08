
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

// Function to create an initial empty grid
const createInitialGrid = (size: number): number[][] => {
  return Array(size).fill(0).map(() => Array(size).fill(0)); // 0 represents 'white'
};

export const useLangtonAnt = (gridSize = GRID_SIZE) => {
  const [grid, setGrid] = useState(() => createInitialGrid(gridSize));
  const [antPosition, setAntPosition] = useState({
    x: Math.floor(gridSize * 0.75),
    y: Math.floor(gridSize * 0.75),
  });

  const [antDirection, setAntDirection] = useState(0); // Start facing up
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [stepCount, setStepCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to perform one step of the simulation
  const step = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => [...row]);
      const { x, y } = antPosition;

      // Check boundary conditions (wrap around)
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
        console.warn("Ant out of bounds, resetting position (this shouldn't happen with wrap-around).");
        setAntPosition({
          x: Math.floor(gridSize * 0.75),
          y: Math.floor(gridSize * 0.75),
        });
        return prevGrid; // Return previous grid if somehow out of bounds
      }

      const currentCellColor = newGrid[y][x]; // 0 for white, 1 for black

      let newDirection: number;
      if (currentCellColor === 0) { // White square
        newDirection = (antDirection + 1) % 4; // Turn right
      } else { // Black square
        newDirection = (antDirection + 3) % 4; // Turn left (equivalent to -1 + 4)
      }

      // Flip the color of the current square
      newGrid[y][x] = 1 - currentCellColor;

      // Move the ant one step forward in the new direction
      const { dx, dy } = directions[newDirection];
      let nextX = (x + dx + gridSize) % gridSize; // Wrap around horizontally
      let nextY = (y + dy + gridSize) % gridSize; // Wrap around vertically


      setAntPosition({ x: nextX, y: nextY });
      setAntDirection(newDirection);
      setStepCount((c) => c + 1);

      return newGrid;
    });
  }, [antPosition, antDirection, gridSize]);

  // Effect to handle the simulation interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup interval on component unmount or when isRunning/speed changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, step]);

  // Function to start the simulation
  const start = () => {
    setIsRunning(true);
  };

  // Function to pause the simulation
  const pause = () => {
    setIsRunning(false);
  };

  // Function to reset the simulation
  const reset = () => {
    setIsRunning(false);
    setGrid(createInitialGrid(gridSize));
    setAntPosition({
      x: Math.floor(gridSize * 0.75),
      y: Math.floor(gridSize * 0.75),
    });
    setAntDirection(0);
    setStepCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function to change simulation speed
  const changeSpeed = (newSpeed: number) => {
    // Clamp speed between defined min and max values
    const clampedSpeed = Math.max(MIN_SPEED_MS, Math.min(newSpeed, MAX_SPEED_MS));
    setSpeed(clampedSpeed);
  };

  return {
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
    step // Expose step function for manual stepping if needed
  };
};
