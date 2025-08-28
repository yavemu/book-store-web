"use client";

import React, { forwardRef } from "react";
import { FormProps } from "../types/FormProps";

function defaultSerialize<T = Record<string, unknown>>(fd: FormData): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (Object.prototype.hasOwnProperty.call(out, key)) {
      const cur = out[key];
      if (Array.isArray(cur)) cur.push(value);
      else out[key] = [cur, value];
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

function InternalForm<T = Record<string, unknown>>(
  { children, onSubmit, onSuccess, serialize, title, ...props }: FormProps<T>,
  ref: React.Ref<HTMLFormElement>,
) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const data = (serialize ?? defaultSerialize)<T>(fd);

    if (!onSubmit) {
      return;
    }

    await Promise.resolve(onSubmit(data));

    try {
      onSuccess?.(data);
    } catch {}
  };

  return (
    <form ref={ref} {...props} onSubmit={handleSubmit}>
      {title ? <h2 className="text-xl font-bold mb-4">{title}</h2> : null}
      {children}
    </form>
  );
}

export const Form = forwardRef(InternalForm) as <T = Record<string, unknown>>(props: FormProps<T> & { ref?: React.Ref<HTMLFormElement> }) => JSX.Element;
