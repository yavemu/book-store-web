import React from 'react';
import { LabelProps } from '../types/LabelProps';

export function Label({ children, ...props }: LabelProps) {
  return <label {...props}>{children}</label>;
}
