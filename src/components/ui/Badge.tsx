interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "cyan" | "green" | "red" | "purple" | "yellow";
}

const variants = {
  orange: "bg-[#FF6B00] text-white",
  cyan: "bg-[#00F0FF] text-black",
  green: "bg-[#00FF66] text-black",
  red: "bg-[#FF0040] text-white",
  purple: "bg-[#8B5CF6] text-white",
  yellow: "bg-[#FFB800] text-black",
};

export default function Badge({ children, variant = "orange" }: BadgeProps) {
  return (
    <div className={`inline-block border-4 border-black px-4 py-2 shadow-[6px_6px_0px_#000000] ${variants[variant]}`}>
      <p className="text-sm font-black uppercase">{children}</p>
    </div>
  );
}
