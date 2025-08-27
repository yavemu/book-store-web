import React from 'react';
import { OutputProps } from '../types/OutputProps';

export function Output({ children, ...props }: OutputProps) {
  return <output {...props}>{children}</output>;
}
