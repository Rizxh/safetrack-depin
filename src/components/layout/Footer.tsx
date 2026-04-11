export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 border-2 border-black bg-[#FF6B00]" />
          <span className="font-heading text-lg font-black uppercase text-black">SafeTrace</span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 text-center md:text-right">
          <p className="text-sm font-black text-black">Smart package tracking, on-chain.</p>
          <p className="text-xs font-black text-black/70">Built for 0G Hackathon - Track 4</p>
        </div>
      </div>
    </footer>
  );
}
