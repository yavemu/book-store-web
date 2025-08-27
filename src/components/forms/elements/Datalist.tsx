import React from 'react';
import { DatalistProps } from '../types/DatalistProps';

export function Datalist({ children, ...props }: DatalistProps) {
  return <datalist {...props}>{children}</datalist>;
}
