import { Check } from "lucide-react";

interface PricingCardProps {
  type: "consumer" | "b2b";
  title: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

function PricingFeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-xs font-semibold text-black">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center border-4 border-black bg-[#00FF66] shadow-[2px_2px_0px_#000000]">
        <Check size={12} strokeWidth={3} className="text-black" />
      </span>
      {text}
    </li>
  );
}

export default function PricingCard({ type, title, description, features, isPopular = false, buttonText }: PricingCardProps) {
  const isB2B = type === "b2b";

  return (
    <div className={`relative border-4 border-black p-6 shadow-[8px_8px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_#000000] ${isB2B ? "bg-[#FFE5CC]" : "bg-white"}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -right-3 -top-3 border-4 border-black bg-[#FF6B00] px-4 py-2 shadow-[3px_3px_0px_#000000]">
          <span className="text-xs font-bold uppercase text-white">Popular</span>
        </div>
      )}

      {/* Type Badge */}
      <div className={`mb-4 inline-block border-4 border-black px-4 py-2 shadow-[3px_3px_0px_#000000] ${isB2B ? "bg-[#FF6B00]" : "bg-[#00F0FF]"}`}>
        <span className={`text-xs font-bold uppercase ${isB2B ? "text-white" : "text-black"}`}>
          {type === "consumer" ? "Consumer" : "B2B"}
        </span>
      </div>

      <h3 className="font-heading text-xl font-bold leading-tight text-black">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-black">{description}</p>

      <ul className="mt-4 space-y-2">
        {features.map((feature) => (
          <PricingFeatureItem key={feature} text={feature} />
        ))}
      </ul>

      <button className={`mt-6 w-full border-4 border-black px-5 py-3 text-sm font-bold uppercase shadow-[4px_4px_0px_#000000] transition-all hover:translate-x-1 hover:shadow-[3px_3px_0px_#000000] ${
        isB2B
          ? "bg-[#FF6B00] text-white hover:bg-[#E55D00]"
          : "bg-white text-black hover:bg-[#00F0FF]"
      }`}>
        {buttonText}
      </button>
    </div>
  );
}
