import { LandingSectionHeader } from "@/components/layout/LandingSectionHeader";

export default function ContactSection() {
  return (
    <section
      id="contact-us"
      className="landing-section-x scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-28"
    >
      <div className="landing-content">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20 xl:gap-24">
          <LandingSectionHeader
            className="max-w-md"
            label="Contact"
            title="Talk to us"
            description="Pilots, custom dashboards, or enterprise rollout—we keep the thread short."
          />
          <form className="glass noise-overlay flex flex-col gap-5 rounded-2xl p-6 sm:p-8 md:p-9">
            <input
              type="text"
              className="rounded-xl border border-[var(--glass-border)]/70 bg-[var(--bg-base)]/40 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/35 focus:ring-2 focus:ring-[var(--accent)]/20"
              placeholder="Name"
            />
            <input
              type="email"
              className="rounded-xl border border-[var(--glass-border)]/70 bg-[var(--bg-base)]/40 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/35 focus:ring-2 focus:ring-[var(--accent)]/20"
              placeholder="Email"
            />
            <textarea
              className="min-h-32 rounded-xl border border-[var(--glass-border)]/70 bg-[var(--bg-base)]/40 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/35 focus:ring-2 focus:ring-[var(--accent)]/20"
              placeholder="What are you shipping?"
            />
            <button
              type="button"
              className="w-fit rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
