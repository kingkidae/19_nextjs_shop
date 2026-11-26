import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "inverse" | "outline-inverse";

const base = "cta inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "h-12 px-8 bg-ink text-canvas hover:bg-ink/85",
  secondary: "h-12 px-8 border border-ink text-ink hover:bg-ink hover:text-canvas",
  text: "h-auto px-0 text-ink underline underline-offset-4 decoration-1 hover:text-ink-2",
  inverse: "h-12 px-8 bg-canvas text-ink hover:bg-canvas/85",
  "outline-inverse": "h-12 px-8 border border-canvas text-canvas hover:bg-canvas hover:text-ink",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function Button({ variant = "primary", className = "", children, ...rest }: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant = "primary", className = "", children }: { href: string; variant?: Variant; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
