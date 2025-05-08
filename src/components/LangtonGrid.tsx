
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LangtonGridProps {
  grid: number[][];
  antPosition: { x: number; y: number };
  antDirection: number;
  isFullscreen: boolean;
}

const directionClasses: { [key: number]: string } = {
  0: 'ant-up',
  1: 'ant-right',
  2: 'ant-down',
  3: 'ant-left',
};

const DEFAULT_CONTAINER_SIZE = 600; // For non-fullscreen

const LangtonGrid: React.FC<LangtonGridProps> = ({ grid, antPosition, antDirection, isFullscreen }) => {
  const gridSize = grid.length;
  const [dynamicCellSize, setDynamicCellSize] = useState(Math.floor(DEFAULT_CONTAINER_SIZE / gridSize));

  useEffect(() => {
    const calculateCellSize = () => {
      if (isFullscreen) {
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        const size = Math.min(displayWidth, displayHeight) * 0.95; // Use 95% of smaller dimension
        setDynamicCellSize(Math.max(1, Math.floor(size / gridSize))); 
      } else {
        // Adjust default size calculation for potentially smaller max-w-max card
        const cardMaxWidth = Math.min(DEFAULT_CONTAINER_SIZE, window.innerWidth * 0.9); // Example: 90vw or 600px
        setDynamicCellSize(Math.max(1, Math.floor(cardMaxWidth / gridSize)));
      }
    };

    calculateCellSize();

    if (isFullscreen) {
      window.addEventListener('resize', calculateCellSize);
      return () => window.removeEventListener('resize', calculateCellSize);
    } else {
      // Recalculate on normal screen resize too, if card size is responsive
      window.addEventListener('resize', calculateCellSize);
      return () => window.removeEventListener('resize', calculateCellSize);
    }
  }, [isFullscreen, gridSize]);

  const actualGridWidth = dynamicCellSize * gridSize;
  const actualGridHeight = dynamicCellSize * gridSize;

  return (
    <div
      className={cn(
        'flex items-center justify-center', 
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-background p-1 sm:p-2' // Fullscreen overlay, bg-background is dark blue
          : 'relative mb-0 w-full' // Ensure it takes available width in card for normal view
      )}
      style={isFullscreen ? {} : { width: `${actualGridWidth}px`, height: `${actualGridHeight}px` }} // Constrain size in normal view
    >
      <div
        className="grid border border-border/30" // Removed bg-card and shadow-md; parent Card handles this. Subtle border for grid lines.
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
              'grid-cell border border-border/20', // Cell border
              {
                // Use theme variables for cell colors, ensuring contrast
                'bg-card-foreground': cellColor === 0, // "White" cells (light, from card's text color)
                'bg-muted': cellColor === 1,         // "Black" cells (muted blue-gray)
                'ant-cell': isAntPosition,           // Ant's current cell (red)
                [directionClasses[antDirection]]: isAntPosition, // Ant's direction indicator
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
                aria-label={`Cell (${x}, ${y}), Color: ${cellColor === 0 ? 'Light' : 'Dark Muted'}${isAntPosition ? ', Ant Position' : ''}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default LangtonGrid;
