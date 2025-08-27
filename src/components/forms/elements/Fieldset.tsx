import React from 'react';
import { FieldsetProps } from '../types/FieldsetProps';

export function Fieldset({ children, ...props }: FieldsetProps) {
  return <fieldset {...props}>{children}</fieldset>;
}
