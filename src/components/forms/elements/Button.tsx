import React from 'react';
import { ButtonProps } from '../types/ButtonProps';

export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
