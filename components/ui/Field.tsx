import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control = "w-full h-12 border border-line bg-canvas px-4 text-[13px] text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink";

export function Field({ label, hint, className = "", ...rest }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-medium">{label}</span>
      <input className={control} {...rest} />
      {hint && <span className="text-[11px] text-ink-2">{hint}</span>}
    </label>
  );
}

export function SelectField({ label, children, className = "", ...rest }: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-medium">{label}</span>
      <span className="relative">
        <select className={`${control} appearance-none pr-10`} {...rest}>
          {children}
        </select>
        <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 9l7 7 7-7" /></svg>
      </span>
    </label>
  );
}

export function TextareaField({ label, className = "", ...rest }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-medium">{label}</span>
      <textarea className={`${control} h-auto min-h-32 py-3 leading-relaxed`} {...rest} />
    </label>
  );
}

export function Checkbox({ label, defaultChecked, className = "", name, required }: { label: ReactNode; defaultChecked?: boolean; className?: string; name?: string; required?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 ${className}`}>
      <input type="checkbox" name={name} required={required} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="grid size-[18px] shrink-0 place-items-center border border-ink bg-canvas text-canvas peer-checked:bg-ink">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </span>
      <span className="text-[13px]">{label}</span>
    </label>
  );
}
