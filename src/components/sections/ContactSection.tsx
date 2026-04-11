export default function ContactSection() {
  return (
    <section id="contact-us" className="scroll-mt-28 border-t border-[var(--glass-border)]/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-md">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">Contact</p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.2] tracking-tight text-[var(--text-primary)] md:text-4xl">
              Talk to us
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
              Pilots, custom dashboards, or enterprise rollout—we keep the thread short.
            </p>
          </div>
          <form className="flex flex-col gap-5">
            <input
              type="text"
              className="glass rounded-xl border-0 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent)]/30"
              placeholder="Name"
            />
            <input
              type="email"
              className="glass rounded-xl border-0 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent)]/30"
              placeholder="Email"
            />
            <textarea
              className="glass min-h-32 rounded-xl border-0 px-4 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-shadow placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent)]/30"
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
