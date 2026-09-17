import Link from "next/link";

// Per-category color coding — small, tasteful accent variation so the tool
// grid doesn't read as one repeated gray card 25 times over. Each group
// gets its own icon-chip color; everything else about the card stays
// consistent.
const GROUP_STYLES = {
  organize: { chip: "bg-brand-tint text-brand" },
  convert: { chip: "bg-accent-light text-accent" },
  edit: { chip: "bg-[#EDE9F7] text-[#5B4B8A]" },
  optimize: { chip: "bg-[#E3F1EE] text-[#0B6B5C]" },
  security: { chip: "bg-[#E7EEF3] text-[#3D5A73]" }
};

export default function ToolCard({ name, description, href, icon, group = "organize" }) {
  const style = GROUP_STYLES[group] || GROUP_STYLES.organize;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-card border border-ink/10 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-transform duration-200 group-hover:scale-110 ${style.chip}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="font-display font-semibold text-ink group-hover:text-brand">{name}</span>
      {description && <span className="text-sm leading-snug text-ink/55">{description}</span>}
      <span
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100"
        aria-hidden="true"
      />
    </Link>
  );
}
