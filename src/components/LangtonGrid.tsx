
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LangtonGridProps {
  grid: number[][];
  antPosition: { x: number; y: number };
  antDirection: number;
}

// Map direction index to CSS class for the ant's arrow indicator
const directionClasses: { [key: number]: string } = {
  0: 'ant-up',
  1: 'ant-right',
  2: 'ant-down',
  3: 'ant-left',
};

const LangtonGrid: React.FC<LangtonGridProps> = ({ grid, antPosition, antDirection }) => {
  const gridSize = grid.length;

  // Calculate cell size based on a fixed container width/height for simplicity
  // You might want a more dynamic calculation based on screen size
  const containerSize = 600; // Example fixed size in pixels
  const cellSize = containerSize / gridSize;

  return (
    <div
      className="grid border border-border shadow-md"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        margin: 'auto', // Center the grid
      }}
      aria-label="Langton's Ant Grid"
    >
      {grid.map((row, y) =>
        row.map((cellColor, x) => {
          const isAntPosition = antPosition.x === x && antPosition.y === y;
          const cellClass = cn(
            'grid-cell border border-border/20', // Add subtle border between cells
            {
              'bg-secondary': cellColor === 0, // Light gray for white cells
              'bg-foreground': cellColor === 1, // Dark gray for black cells
              'ant-cell': isAntPosition,
              [directionClasses[antDirection]]: isAntPosition, // Add direction class if it's the ant
            }
          );

          return (
            <div
              key={`${x}-${y}`}
              className={cellClass}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
              role="gridcell"
              aria-label={`Cell (${x}, ${y}), Color: ${cellColor === 0 ? 'White' : 'Black'}${isAntPosition ? ', Ant Position' : ''}`}
            />
          );
        })
      )}
    </div>
  );
};

export default LangtonGrid;
