import Badge from "./Badge";

interface SectionHeadingProps {
  badge: string;
  title: string;
  highlight?: string;
  description?: string;
}

export default function SectionHeading({ badge, title, highlight, description }: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <Badge>{badge}</Badge>
      <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl">
        {title}
        {highlight && (
          <>
            <br />
            <span className="inline-block border-4 border-black bg-[#00F0FF] px-4 py-1 text-black shadow-[4px_4px_0px_#000000]">
              {highlight}
            </span>
          </>
        )}
      </h2>
      {description && <p className="mt-4 max-w-xl text-base font-semibold text-black">{description}</p>}
    </div>
  );
}
