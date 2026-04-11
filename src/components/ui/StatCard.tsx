interface StatCardProps {
  value: string | number;
  suffix?: string;
  label: string;
  color?: "orange" | "cyan" | "green" | "red" | "purple" | "yellow" | "white";
  showPulse?: boolean;
}

const colors = {
  orange: "bg-[#FF6B00]",
  cyan: "bg-[#00F0FF]",
  green: "bg-[#00FF66]",
  red: "bg-[#FF0040]",
  purple: "bg-[#8B5CF6]",
  yellow: "bg-[#FFB800]",
  white: "bg-white",
};

export default function StatCard({ value, suffix, label, color = "white", showPulse = false }: StatCardProps) {
  return (
    <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#000000]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-black/70">{label}</p>
        {showPulse && (
          <div className="flex h-2 w-2 items-center">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF66]" />
          </div>
        )}
      </div>
      <div className="font-heading text-3xl font-black leading-none text-black sm:text-4xl">
        {value}
        {suffix && <span className="text-lg">{suffix}</span>}
      </div>
    </div>
  );
}
