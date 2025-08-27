import React from "react";

export interface FormProps<T = Record<string, any>> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit?: (data: T) => void | Promise<void>;
  onSuccess?: (data: T) => void;
  serialize?: (formData: FormData) => T;
  title?: string;
  children?: React.ReactNode;
}
