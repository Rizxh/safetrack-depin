'use client';

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Live Demo", href: "#live-sensor" },
];

export default function Navbar() {
  const router = useRouter();
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

  return (
    <header
      ref={navRef}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "border-b-4 border-black bg-white" : "border-b-4 border-black bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3 border-4 border-black bg-[#CCFF00] px-4 py-2 shadow-[4px_4px_0px_#000000]">
          <span className="h-4 w-4 border-2 border-black bg-[#2979FF]" />
          <span className="font-display text-lg font-black uppercase tracking-tight text-black">
            SafeTrace
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold uppercase text-black transition-all hover:bg-[#CCFF00] hover:px-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Connect Button */}
        <div className="hidden md:block">
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
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="border-4 border-black bg-white px-6 py-2 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#CCFF00] hover:shadow-[3px_3px_0px_#000000]"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="border-4 border-black bg-[#FF0040] px-6 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#000000]"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push('/admin')}
                          className="border-4 border-black bg-[#2979FF] px-6 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#000000]"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#CCFF00] hover:shadow-[3px_3px_0px_#000000]"
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
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="border-4 border-black bg-white p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5 text-black" strokeWidth={3} /> : <Menu className="h-5 w-5 text-black" strokeWidth={3} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t-4 border-black bg-white px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-4 border-black bg-white px-4 py-3 text-left text-sm font-black uppercase text-black transition-all hover:translate-x-1 hover:bg-[#CCFF00] hover:shadow-[4px_4px_0px_#000000]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4">
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
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="w-full border-4 border-black bg-white px-4 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:bg-[#00F0FF] hover:shadow-[3px_3px_0px_#000000]"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="w-full border-4 border-black bg-[#FF0040] px-4 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:shadow-[3px_3px_0px_#000000]"
                            >
                              Wrong Network
                            </button>
                          );
                        }

                        return (
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => {
                                router.push('/admin');
                                setOpen(false);
                              }}
                              className="w-full border-4 border-black bg-[#2979FF] px-4 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:shadow-[3px_3px_0px_#000000]"
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="w-full border-4 border-black bg-white px-4 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:bg-[#CCFF00] hover:shadow-[3px_3px_0px_#000000]"
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
