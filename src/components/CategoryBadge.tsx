import type { Category } from "@/lib/types";

const STYLES: Record<Category, string> = {
  Nominee: "bg-accent-tint text-accent",
  Partner: "bg-good-bg text-good-text",
  VIP: "bg-purple-bg text-purple-text",
  "Ticket Holder": "bg-neutral-bg text-neutral-text",
  "VIP Dinner": "bg-warn-bg text-warn-text",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${STYLES[category]}`}
    >
      {category}
    </span>
  );
}
