import React from 'react';
import { OptionProps } from '../types/OptionProps';

export function Option({ children, ...props }: OptionProps) {
  return <option {...props}>{children}</option>;
}
