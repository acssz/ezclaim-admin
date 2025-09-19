"use client";

import clsx from "clsx";
import type { ForwardedRef, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef(function Input(
  { className, label, id, error, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputId = id || props.name;
  return (
    <div>
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input ref={ref} className={clsx("input", className)} id={inputId} {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});
