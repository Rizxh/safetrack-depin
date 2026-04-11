export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-8 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span className="text-sm font-semibold text-white">Safetrack</span>
        </div>
        <p className="text-xs text-zinc-500">Smart package tracking, on-chain.</p>
        <p className="text-xs text-zinc-500">Built for 0G Hackathon - Track 4</p>
      </div>
    </footer>
  );
}
