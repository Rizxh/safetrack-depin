import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GSAPScrollOptions extends gsap.TweenVars {
  start?: string;
  end?: string;
  once?: boolean;
}

export function useGSAPScrollTrigger<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: GSAPScrollOptions = {}
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { start = "top 85%", end = "bottom 60%", once = true, ...vars } = options;

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          ...vars,
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            once,
            ...(vars.scrollTrigger ?? {}),
          },
        }
      );
    }, ref);

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [options, ref]);

  return ctxRef.current;
}
