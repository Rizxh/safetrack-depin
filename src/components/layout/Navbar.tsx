import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Steps", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact-us" },
];

const scrollOffset = 96;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [showNav, setShowNav] = useState(true);
  const lastScrollYRef = useRef(0);
  const sectionElsRef = useRef<HTMLElement[]>([]);
  const activeRef = useRef("#home");

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    sectionElsRef.current = links
      .map((link) => document.querySelector(link.href))
      .filter((el): el is HTMLElement => Boolean(el));

    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY <= 24) {
        setShowNav(true);
      } else if (currentY > lastY + 4) {
        setShowNav(false);
        setOpen(false);
      } else if (currentY < lastY - 4) {
        setShowNav(true);
      }

      const homeEl = document.querySelector("#home");
      if (homeEl && currentY + 120 < (homeEl as HTMLElement).offsetHeight) {
        if (activeRef.current !== "#home") setActive("#home");
      } else {
        const currentSection = [...sectionElsRef.current]
          .reverse()
          .find((section) => currentY + scrollOffset + 40 >= section.offsetTop);
        if (currentSection) {
          const id = `#${currentSection.id}`;
          if (id !== activeRef.current) setActive(id);
        }
      }

      lastScrollYRef.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const y = (el as HTMLElement).offsetTop - scrollOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(href);
      setOpen(false);
    }
  };

  const scrollHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("#home");
    setOpen(false);
  };

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[90%] max-w-5xl -translate-x-1/2 md:top-5">
      {/* GLASS SURFACE — floating nav — vertical hide preserves horizontal center */}
      <nav
        className={`glass-strong relative rounded-2xl px-4 py-2.5 shadow-lg shadow-black/20 transition-all duration-300 sm:px-6 sm:py-3 ${
          showNav ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={scrollHome}
            className="font-mono text-sm font-semibold tracking-tight text-[var(--text-primary)]"
            aria-label="Safetrack home"
          >
            Safetrack
          </button>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  active === link.href
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => scrollToSection("#contact-us")}
              className="glass rounded-xl px-4 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Get started
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-secondary)] lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-3 border-t border-[var(--glass-border)] pt-3 lg:hidden">
            <div className="flex max-h-[min(60vh,420px)] flex-col gap-1 overflow-y-auto">
              {links.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  className={`rounded-lg py-2.5 text-left text-sm ${
                    active === link.href ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  }`}
                  onClick={() => scrollToSection(link.href)}
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                className="glass mt-2 rounded-xl px-4 py-2.5 text-left text-sm text-[var(--text-secondary)]"
                onClick={() => scrollToSection("#contact-us")}
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
