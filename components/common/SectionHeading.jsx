import { cn } from "@/lib/utils";

const SectionHeading = ({ title, tagline, className }) => (
  <div
    className={cn(
      "w-full text-left flex items-center gap-2 border-y border-gray-300 bg-gray-100 py-2 px-3",
      className
    )}
  >
    <h2 className="font-bold uppercase text-lg">{title}</h2>
    {tagline && <p className="uppercase text-sm text-gray-400">{tagline}</p>}
  </div>
);
export default SectionHeading;
