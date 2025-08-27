import React from "react";
import { TextareaProps } from "../types/TextareaProps";

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div>
      {label && <label htmlFor={props.id}>{label}</label>}
      <textarea {...props} />
    </div>
  );
}
