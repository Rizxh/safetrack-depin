"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECT_SHORT_NAME } from "@/config/brand";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Steps", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact-us" },
];

const scrollOffset = 96;

/** Posisi atas elemen relatif dokumen (aman walau ada ancestor `transform`, mis. ScrollReveal). */
function elementDocumentTop(el: Element): number {
  const rect = (el as HTMLElement).getBoundingClientRect();
  return rect.top + window.scrollY;
}

function WalletNavActions({
  className,
  onNavigate,
  stackVertical,
  lightSurface,
}: {
  className?: string;
  onNavigate?: () => void;
  /** Menu mobile: tombol Dashboard + akun full width, vertikal */
  stackVertical?: boolean;
  lightSurface?: boolean;
}) {
  const router = useRouter();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            className={className}
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none" as const,
                userSelect: "none" as const,
              },
            })}
          >
            {(() => {
              const btnBlock = stackVertical ? "w-full justify-center py-2.5" : "";

              if (!connected) {
                return (
                  <button
                    type="button"
                    onClick={openConnectModal}
                    className={`rounded-xl bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${btnBlock}`}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    type="button"
                    onClick={openChainModal}
                    className={`rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-200 ${btnBlock}`}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className={stackVertical ? "flex w-full flex-col gap-2" : "flex items-center gap-2"}>
                  <button
                    type="button"
                    onClick={() => {
                      void router.push("/admin");
                      onNavigate?.();
                    }}
                    className={`rounded-xl bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${btnBlock}`}
                  >
                    Go to dashboard
                  </button>
                  <button
                    type="button"
                    onClick={openAccountModal}
                    className={cn(
                      "truncate rounded-xl px-3 py-1.5 text-sm transition-colors",
                      stackVertical ? "w-full max-w-none py-2.5" : "max-w-[140px]",
                      lightSurface
                        ? "border border-white/50 bg-white/40 text-zinc-800 hover:border-white/55 hover:bg-white/45 hover:text-zinc-950"
                        : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

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
          .find((section) => currentY + scrollOffset + 40 >= elementDocumentTop(section));
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
    if (!el) return;
    const y = elementDocumentTop(el) - scrollOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    setActive(href);
    setOpen(false);
  };

  const scrollHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("#home");
    setOpen(false);
  };

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(92%,calc(100%-1.5rem))] max-w-7xl -translate-x-1/2 md:top-5">
      <nav
        className={`relative rounded-2xl px-4 py-2.5 shadow-lg transition-all duration-300 sm:px-6 sm:py-3 lg:px-5 lg:py-2 ${
          open
            ? "border border-white/55 bg-white/40 shadow-zinc-300/15 backdrop-blur-2xl lg:border-[var(--glass-border)] lg:bg-[var(--bg-elevated)] lg:shadow-black/35"
            : "glass-strong backdrop-blur-2xl shadow-black/20"
        } ${showNav ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={scrollHome}
            className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label={`${PROJECT_SHORT_NAME} home`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={480}
              height={120}
              className="h-9 w-auto max-w-[min(300px,88vw)] shrink-0 object-contain object-left sm:h-14 sm:max-w-[min(360px,75vw)] md:h-16 md:max-w-[min(400px,68vw)] lg:hidden scale-[2.5] origin-left translate-y-2"
              priority
            />
            <Image
              src="/icon.png"
              alt=""
              width={256}
              height={256}
              className="hidden h-9 w-9 shrink-0 object-contain lg:block"
            />
          </button>

          <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                className={`rounded-lg px-2 py-1 text-sm transition-colors lg:px-2.5 lg:py-1 ${
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

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <WalletNavActions />
          </div>

          <button
            type="button"
            className={cn(
              "rounded-lg p-2 lg:hidden",
              open ? "text-zinc-800" : "text-[var(--text-secondary)]"
            )}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-3 border-t border-white/45 pt-3 lg:hidden">
            <div className="flex max-h-[min(60vh,420px)] flex-col gap-1 overflow-y-auto px-0 pb-1">
              {links.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  className={`rounded-lg py-2.5 text-left text-sm transition-colors ${
                    active === link.href
                      ? "font-medium text-zinc-900"
                      : "text-zinc-700 hover:bg-white/35 hover:text-zinc-900"
                  }`}
                  onClick={() => scrollToSection(link.href)}
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 border-t border-white/45 pt-3">
                <WalletNavActions
                  stackVertical
                  lightSurface
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
