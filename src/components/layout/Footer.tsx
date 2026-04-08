export default function Footer() {
  return (
    <footer className="border-t border-ink-muted/10 px-8 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span className="text-sm font-semibold text-ink-primary">SafeTrace</span>
        </div>
        <p className="text-xs text-ink-muted">Smart package tracking, on-chain.</p>
        <p className="text-xs text-ink-muted">Built for 0G Hackathon - Track 4</p>
      </div>
    </footer>
  );
}
