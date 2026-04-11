import { SectionHeading, PricingCard } from "@/components/ui";

const consumerFeatures = [
  "Live GPS + sensor dashboard",
  "AI damage prediction report",
  "Auto-claim on damage detection",
  "Return via Indomaret / JNE",
];

const b2bFeatures = [
  "Device pool management",
  "White-label dashboard option",
  "REST API + webhooks",
  "Priority 0G storage allocation",
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-y-4 border-black bg-[#F4F4F4] px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="PRICING"
          title="TWO WAYS TO"
          highlight="USE SAFETRACE"
          description="Consumer or enterprise - we have you covered."
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <PricingCard
            type="consumer"
            title="DEPOSIT & RETURN"
            description="Pay a small deposit, device ships with your package. Return after delivery - refunded automatically via smart contract."
            features={consumerFeatures}
            buttonText="Get Started"
          />

          <PricingCard
            type="b2b"
            title="LOGISTICS PARTNER"
            description="Integrate SafeTrace into your fleet. Offer premium secure shipping as a paid add-on to customers."
            features={b2bFeatures}
            buttonText="Contact Us"
            isPopular
          />
        </div>
      </div>
    </section>
  );
}
