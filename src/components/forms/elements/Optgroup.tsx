import React from 'react';
import { OptgroupProps } from '../types/OptgroupProps';

export function Optgroup({ children, ...props }: OptgroupProps) {
  return <optgroup {...props}>{children}</optgroup>;
}
