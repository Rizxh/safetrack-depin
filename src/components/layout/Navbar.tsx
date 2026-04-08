import { useEffect, useRef, useState } from "react";
import { Bell, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact us", href: "#contact-us" },
  { label: "Docs", href: "#docs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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
      setScrolled(currentY > 80);

      if (currentY <= 24) {
        setShowNav(true);
      } else if (currentY > lastY + 4) {
        setShowNav(false);
        setOpen(false);
      } else if (currentY < lastY - 4) {
        setShowNav(true);
      }

      const currentSection = [...sectionElsRef.current]
        .reverse()
        .find((section) => currentY + 120 >= section.offsetTop);
      if (currentSection) {
        const id = `#${currentSection.id}`;
        if (id !== activeRef.current) setActive(id);
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
      const y = (el as HTMLElement).offsetTop - 88;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(href);
      setOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-screen transition-all duration-300 ${
        showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${scrolled ? "backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="hidden w-full items-center md:flex">
          <div className="mx-auto flex w-full max-w-6xl items-center rounded-full border border-white/35 bg-[#0B1F31]/80 px-3 py-2 shadow-[0_14px_40px_rgba(4,17,31,0.45)] backdrop-blur-2xl">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mr-4 flex shrink-0 items-center gap-2 rounded-full px-2 py-1"
              aria-label="SafeTrace home"
            >
              <span className="text-2xl font-bold uppercase tracking-tight text-white">ST</span>
            </button>

            <nav className="flex flex-1 items-center justify-center gap-1">
              {links.map((link) => (
                <button
                  key={link.label}
                  className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                    active === link.href
                      ? "bg-white text-[#0B1F31] shadow-sm"
                      : "text-slate-100 hover:bg-white/15 hover:text-white"
                  }`}
                  onClick={() => scrollToSection(link.href)}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <button
              className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="w-full md:hidden">
          <div className="mx-auto flex max-w-xs items-center justify-between rounded-full border border-white/35 bg-[#0B1F31]/85 px-4 py-2 shadow-[0_14px_40px_rgba(4,17,31,0.45)] backdrop-blur-2xl">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-2xl font-bold uppercase tracking-tight text-white"
              aria-label="SafeTrace home"
            >
              ST
            </button>
            <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="px-4 pt-2 md:hidden">
          <div className="mx-auto max-w-xs rounded-2xl border border-white/35 bg-[#0B1F31]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-2 px-1">
              <span className="text-2xl font-bold uppercase tracking-tight text-white">ST</span>
            </div>
            {links.map((link) => (
              <button
                key={link.label}
                className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active === link.href ? "bg-white text-[#0B1F31]" : "text-slate-100 hover:bg-white/15"
                }`}
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </button>
            ))}
            <button className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm text-white">
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
