import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingSectionHeaderProps = {
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
};

/**
 * Matches hero typography: glass pill label + bold title + relaxed lead (max-w-xl).
 */
export function LandingSectionHeader({ label, title, description, className }: LandingSectionHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <div className="glass noise-overlay relative mb-6 inline-flex w-fit max-w-full items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--text-secondary)]">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
        {label}
      </div>
      <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] xl:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">{description}</p>
      ) : null}
    </header>
  );
}
