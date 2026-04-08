export default function ContactSection() {
  return (
    <section id="contact-us" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-ink-muted/15 bg-surface-secondary p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-teal-400">Contact us</p>
          <h2 className="mt-3 text-3xl font-medium text-ink-primary">Let us secure your logistics flow</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
            Talk with our team for pilot deployment, dashboard customization, and enterprise integration support.
          </p>
        </div>
        <form className="grid grid-cols-1 gap-3">
          <input
            className="rounded-xl border border-ink-muted/20 px-4 py-3 text-sm outline-none ring-teal-300 transition focus:ring-2"
            placeholder="Full name"
          />
          <input
            className="rounded-xl border border-ink-muted/20 px-4 py-3 text-sm outline-none ring-teal-300 transition focus:ring-2"
            placeholder="Email address"
          />
          <textarea
            className="min-h-28 rounded-xl border border-ink-muted/20 px-4 py-3 text-sm outline-none ring-teal-300 transition focus:ring-2"
            placeholder="Tell us about your shipping use case"
          />
          <button className="w-fit rounded-xl bg-linear-to-r from-teal-400 to-blue-500 px-5 py-2.5 text-sm font-medium text-white">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
