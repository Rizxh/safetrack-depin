"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Fade + slight translate per section on enter/leave viewport.
 * One IntersectionObserver per instance; respects prefers-reduced-motion via CSS.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncFromRect = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return r.top < vh * 0.88 && r.bottom > vh * 0.07;
    };

    setVisible(syncFromRect());

    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: [0, 0.06, 0.12], rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setArmed(true));
    });

    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal w-full min-w-0",
        armed && "scroll-reveal--armed",
        visible ? "scroll-reveal--in" : "scroll-reveal--out",
        className
      )}
    >
      {children}
    </div>
  );
}
