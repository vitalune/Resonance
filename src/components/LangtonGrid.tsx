"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Corresponds to directions in useLangtonAnt: 0: up, 1: right, 2: down, 3: left
const directionClasses: { [key: number]: string } = {
  0: 'ant-up',
  1: 'ant-right',
  2: 'ant-down',
  3: 'ant-left',
};

interface AntRenderInfo {
  id: string;
  x: number;
  y: number;
  direction: number;
  color: string; // CSS color string for the ant's body
}

interface LangtonGridProps {
  grid: number[][]; // Grid can now have values 0, 1, 2, etc.
  ants: AntRenderInfo[];
  isFullscreen: boolean;
}

const DEFAULT_CONTAINER_SIZE = 600; // For non-fullscreen

const LangtonGrid: React.FC<LangtonGridProps> = ({ grid, ants, isFullscreen }) => {
  const gridSize = grid.length;
  const [dynamicCellSize, setDynamicCellSize] = useState(Math.floor(DEFAULT_CONTAINER_SIZE / gridSize));

  useEffect(() => {
    const calculateCellSize = () => {
      if (isFullscreen) {
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        const size = Math.min(displayWidth, displayHeight) * 0.95;
        setDynamicCellSize(Math.max(1, Math.floor(size / gridSize))); 
      } else {
        const cardMaxWidth = Math.min(DEFAULT_CONTAINER_SIZE, window.innerWidth * 0.9);
        setDynamicCellSize(Math.max(1, Math.floor(cardMaxWidth / gridSize)));
      }
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [isFullscreen, gridSize]);

  const actualGridWidth = dynamicCellSize * gridSize;
  const actualGridHeight = dynamicCellSize * gridSize;

  return (
    <div
      className={cn(
        'flex items-center justify-center', 
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-background p-1 sm:p-2'
          : 'relative mb-0 w-full'
      )}
      style={isFullscreen ? {} : { width: `${actualGridWidth}px`, height: `${actualGridHeight}px` }}
    >
      <div
        className="grid"
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
          row.map((cellState, x) => {
            let cellBgClass = 'bg-muted'; // Default for state 0 (background)
            if (cellState === 1) {
              cellBgClass = 'bg-card-foreground'; // Ant 1 trail (white-ish)
            } else if (cellState === 2) {
              cellBgClass = 'bg-accent'; // Ant 2 trail (yellow)
            }

            const antsOnThisCell = ants.filter(ant => ant.x === x && ant.y === y);
            
            return (
              <div
                key={`${x}-${y}`}
                className={cn('grid-cell relative', cellBgClass)} // Added 'relative' for ant positioning
                style={{
                  width: `${dynamicCellSize}px`,
                  height: `${dynamicCellSize}px`,
                }}
                role="gridcell"
                aria-label={`Cell (${x}, ${y}), State: ${cellState}`}
              >
                {antsOnThisCell.map(ant => (
                  <div
                    key={ant.id}
                    className={cn(
                      'ant-indicator-base', // Base class for arrow pseudo-element
                      directionClasses[ant.direction] // Applies the correct arrow direction
                    )}
                    style={{
                      backgroundColor: ant.color, // Ant's body color
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                    }}
                    aria-label={`Ant ${ant.id} at (${x},${y}) facing ${directionClasses[ant.direction]}`}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LangtonGrid;
