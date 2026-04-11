interface StepCardProps {
  number: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export default function StepCard({ number, title, description, color, bgColor }: StepCardProps) {
  return (
    <div className={`group relative border-4 border-black p-6 shadow-[8px_8px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#000000] ${bgColor}`}>
      {/* Step Number Badge */}
      <div
        className="absolute -right-3 -top-3 border-4 border-black px-4 py-2 shadow-[3px_3px_0px_#000000]"
        style={{ backgroundColor: color }}
      >
        <span className="font-heading text-xl font-black text-white">{number}</span>
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl font-bold leading-tight text-black">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-black">{description}</p>

      {/* Decorative element */}
      <div
        className="absolute bottom-3 right-3 h-12 w-12 opacity-30 transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
