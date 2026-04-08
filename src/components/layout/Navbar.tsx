import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#stats" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }, navRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "border-b border-ink-muted/20 bg-white/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span className="text-sm font-semibold text-ink-primary">SafeTrace</span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <button
              key={link.label}
              className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
              onClick={() => scrollToSection(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button className="rounded-lg bg-teal-400 px-4 py-2 text-sm text-white transition-colors hover:bg-teal-600">
            Get started
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5 text-ink-primary" /> : <Menu className="h-5 w-5 text-ink-primary" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-muted/20 bg-white/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <button
                key={link.label}
                className="rounded-md px-2 py-2 text-left text-sm text-ink-secondary hover:bg-surface-secondary"
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </button>
            ))}
            <button className="mt-2 rounded-lg bg-teal-400 px-4 py-2 text-sm text-white">Get started</button>
          </div>
        </div>
      )}
    </header>
  );
}
