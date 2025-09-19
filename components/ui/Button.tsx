"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "btn-md",
  sm: "btn-sm",
};

export const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", leftIcon, rightIcon, children, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button ref={ref} className={clsx("btn", variantClass[variant], sizeClass[size], className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
