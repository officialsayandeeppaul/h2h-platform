"use client";

import React from 'react';
import type { ReactNode } from 'react';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={itemClassName}>
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div className="space-y-6">
        {childArray.map((child, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollStack;
