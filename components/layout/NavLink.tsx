"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface NavLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  onNavigate?: () => void;
}

export function NavLink({ href, label, icon, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={clsx("nav-link", { active: isActive })}
      onClick={onNavigate}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
