interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
}

export default function FeatureCard({ icon, title, description, color = "#FF6B00", bgColor = "bg-[#FFE5CC]" }: FeatureCardProps) {
  return (
    <div className={`${bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#000000]`}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center border-4 border-black bg-white shadow-[3px_3px_0px_#000000]">
          {icon}
        </div>
      )}
      <h3 className="mb-3 font-heading text-xl font-bold leading-tight text-black">{title}</h3>
      <p className="text-sm font-semibold leading-relaxed text-black">{description}</p>
      <div className="mt-4 h-2 w-full shadow-[2px_2px_0px_#000000]" style={{ backgroundColor: color }} />
    </div>
  );
}
