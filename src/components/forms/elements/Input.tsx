import React from "react";
import { InputProps } from "../types/InputProps";

export function Input({ label, ...props }: InputProps) {
  props.placeholder = props.placeholder ?? label ?? "";
  return (
    <div>
      {label && <label htmlFor={props.id}>{label}</label>}
      <input {...props} />
    </div>
  );
}
