import React from 'react';
import { LegendProps } from '../types/LegendProps';

export function Legend({ children, ...props }: LegendProps) {
  return <legend {...props}>{children}</legend>;
}
