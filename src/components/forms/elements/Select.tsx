import React from "react";
import { SelectProps } from "../types/SelectProps";

export function Select({ label, children, ...props }: SelectProps) {
  return (
    <div>
      {label && <label htmlFor={props.id}>{label}</label>}
      <select {...props}>{children}</select>
    </div>
  );
}
