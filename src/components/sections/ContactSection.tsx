export default function ContactSection() {
  return (
    <section
      id="contact-us"
      className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.1),transparent_40%),radial-gradient(circle_at_20%_70%,rgba(16,185,129,0.08),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-teal-300">Contact us</p>
          <h2 className="mt-3 text-3xl font-medium text-white">Let us secure your logistics flow</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            Talk with our team for pilot deployment, dashboard customization, and enterprise integration support.
          </p>
        </div>
        <form className="grid grid-cols-1 gap-3">
          <input
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-teal-400/50 transition placeholder:text-zinc-500 focus:ring-2"
            placeholder="Full name"
          />
          <input
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-teal-400/50 transition placeholder:text-zinc-500 focus:ring-2"
            placeholder="Email address"
          />
          <textarea
            className="min-h-28 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-teal-400/50 transition placeholder:text-zinc-500 focus:ring-2"
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
