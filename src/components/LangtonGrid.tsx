
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LangtonGridProps {
  grid: number[][];
  antPosition: { x: number; y: number };
  antDirection: number;
  isFullscreen: boolean;
}

// Map direction index to CSS class for the ant's arrow indicator
const directionClasses: { [key: number]: string } = {
  0: 'ant-up',
  1: 'ant-right',
  2: 'ant-down',
  3: 'ant-left',
};

const DEFAULT_CONTAINER_SIZE = 600;

const LangtonGrid: React.FC<LangtonGridProps> = ({ grid, antPosition, antDirection, isFullscreen }) => {
  const gridSize = grid.length;
  const [dynamicCellSize, setDynamicCellSize] = useState(Math.floor(DEFAULT_CONTAINER_SIZE / gridSize));

  useEffect(() => {
    const calculateCellSize = () => {
      if (isFullscreen) {
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        // Use 95% of the smaller dimension to leave some padding and maintain aspect ratio
        const size = Math.min(displayWidth, displayHeight) * 0.95;
        setDynamicCellSize(Math.max(1, Math.floor(size / gridSize))); // Ensure cell size is at least 1px
      } else {
        setDynamicCellSize(Math.max(1, Math.floor(DEFAULT_CONTAINER_SIZE / gridSize)));
      }
    };

    calculateCellSize(); // Initial calculation

    if (isFullscreen) {
      window.addEventListener('resize', calculateCellSize);
      return () => window.removeEventListener('resize', calculateCellSize);
    }
  }, [isFullscreen, gridSize]);

  const actualGridWidth = dynamicCellSize * gridSize;
  const actualGridHeight = dynamicCellSize * gridSize;

  return (
    <div
      className={cn(
        'flex items-center justify-center', // Centers the grid within this container
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-background p-2' // Fullscreen overlay with slight padding
          : 'relative mb-0' // Relative positioning for normal flow, mb-0 to counteract SimulationControls mt-6 if CardContent has no padding
      )}
      // This outer div handles fullscreen overlay and centering
    >
      <div
        className="grid border border-border shadow-md bg-card" // Added bg-card for better contrast of cells
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${dynamicCellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${dynamicCellSize}px)`,
          width: `${actualGridWidth}px`,
          height: `${actualGridHeight}px`,
        }}
        aria-label="Langton's Ant Grid"
        role="grid"
      >
        {grid.map((row, y) =>
          row.map((cellColor, x) => {
            const isAntPosition = antPosition.x === x && antPosition.y === y;
            const cellClass = cn(
              'grid-cell border border-border/20',
              {
                'bg-secondary': cellColor === 0, // White cells
                'bg-foreground': cellColor === 1, // Black cells
                'ant-cell': isAntPosition,
                [directionClasses[antDirection]]: isAntPosition,
              }
            );

            return (
              <div
                key={`${x}-${y}`}
                className={cellClass}
                style={{
                  width: `${dynamicCellSize}px`,
                  height: `${dynamicCellSize}px`,
                }}
                role="gridcell"
                aria-label={`Cell (${x}, ${y}), Color: ${cellColor === 0 ? 'White' : 'Black'}${isAntPosition ? ', Ant Position' : ''}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default LangtonGrid;
