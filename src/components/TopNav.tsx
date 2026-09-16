import Link from "next/link";

const TABS = [
  { href: "/desk", label: "Desk" },
  { href: "/overview", label: "Overview" },
  { href: "/config", label: "Config" },
] as const;

export function TopNav({
  active,
  userEmail,
}: {
  active: (typeof TABS)[number]["label"];
  userEmail: string;
}) {
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="no-print h-15 bg-surface border-b border-border flex items-center justify-between px-7">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#EAF1FB" stroke="#D6E3F5" />
            <rect x="11" y="13" width="18" height="3" rx="1.5" fill="#2C5DA8" />
            <rect x="11" y="19" width="14" height="3" rx="1.5" fill="#2C5DA8" opacity="0.7" />
            <rect x="11" y="25" width="10" height="3" rx="1.5" fill="#2C5DA8" opacity="0.45" />
          </svg>
          <span className="text-[15px] font-semibold text-text">Galien Guest Lists</span>
        </div>
        <nav className="flex items-center gap-1 bg-neutral-bg rounded-lg p-1">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium ${
                active === tab.label
                  ? "bg-surface shadow-sm font-semibold text-text"
                  : "text-text-muted"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 rounded-full bg-accent-tint text-accent flex items-center justify-center text-[13px] font-bold">
          {initial}
        </div>
        <span className="text-[13px] text-text-muted">{userEmail}</span>
      </div>
    </header>
  );
}
