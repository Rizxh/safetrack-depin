import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECT_SHORT_NAME } from "@/config/brand";

const scrollOffset = 96;

const productLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Project flow", href: "#flow" },
];

const resourceLinks = [
  { label: "Documentation", href: "#docs" },
  { label: "FAQ", href: "#faqs" },
  { label: "Contact", href: "#contact-us" },
];

function scrollToHash(e: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) {
    const y = (el as HTMLElement).offsetTop - scrollOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default function Footer() {
  return (
    <footer className="w-full min-w-0 border-t border-[var(--glass-border)]/80 bg-[var(--bg-base)]/95 pb-10 pt-16">
      <div className="landing-section-x w-full max-w-none">
        <div className="landing-content">
          <div className="grid gap-12 border-b border-[var(--glass-border)]/60 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                onClick={(e) => scrollToHash(e, "#home")}>
                <Image
                  src="/logo.png"
                  alt=""
                  width={320}
                  height={80}
                  className="h-15 w-auto max-w-[min(240px,88vw)] shrink-0 object-contain object-left sm:h-16 sm:max-w-[min(280px,75vw)] lg:block scale-[2.5] origin-left"
                />
                <Image
                  src="/icon.png"
                  alt=""
                  width={512}
                  height={512}
                  className="hidden h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 lg:hidden"
                />
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                DePIN logistics visibility—sensors, risk signals, and proofs in
                one place for teams that need calm, defensible transit data.
              </p>
            </div>

            {/* Product */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Product
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {productLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      onClick={(e) => scrollToHash(e, item.href)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Resources
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {resourceLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      onClick={(e) => scrollToHash(e, item.href)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Contact
              </h3>
              <ul className="mt-4 flex flex-col gap-4 text-sm text-[var(--text-secondary)]">
                <li>
                  <span className="block text-xs text-[var(--text-muted)]">
                    Email
                  </span>
                  <a
                    href="mailto:hello@safetrack.io"
                    className="mt-0.5 inline-block text-[var(--text-primary)] transition-opacity hover:opacity-80">
                    hello@safetrack.io
                  </a>
                </li>
                <li>
                  <span className="block text-xs text-[var(--text-muted)]">
                    Built for
                  </span>
                  <span className="mt-0.5 block">0G Hackathon · Track 4</span>
                </li>
                <li className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline">
                    Twitter
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline">
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-[var(--text-muted)]">
              © 2026 {PROJECT_SHORT_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
              <a
                href="#"
                className="transition-colors hover:text-[var(--text-secondary)]">
                Privacy
              </a>
              <a
                href="#"
                className="transition-colors hover:text-[var(--text-secondary)]">
                Terms
              </a>
              <a
                href="#"
                className="transition-colors hover:text-[var(--text-secondary)]">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
