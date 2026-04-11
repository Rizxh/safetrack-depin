export default function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] px-4 py-8 sm:px-6">
      <div className="glass-strong mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl px-6 py-6 sm:flex-row sm:items-center">
        <span className="font-mono text-sm text-[var(--text-muted)]">© 2026</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <span className="text-sm font-medium text-[var(--text-primary)]">Safetrack</span>
          <p className="text-sm text-[var(--text-muted)]">On-chain logistics proof.</p>
          <p className="text-sm text-[var(--text-muted)]">0G Hackathon · Track 4</p>
        </div>
      </div>
    </footer>
  );
}
