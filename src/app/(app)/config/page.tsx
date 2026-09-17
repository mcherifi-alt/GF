import { auth } from "@/auth";
import { TopNav } from "@/components/TopNav";
import { CategoryBadge } from "@/components/CategoryBadge";
import { getEventConfig, getProductMapping, getSyncStatus, getTicketTailorConfig } from "@/lib/data/source";
import type { Category } from "@/lib/types";

const CATEGORIES: Category[] = ["Nominee", "Partner", "VIP", "Ticket Holder", "VIP Dinner"];

export default async function ConfigPage() {
  const session = await auth();
  const [eventConfig, productMapping, syncStatus, ticketTailor] = await Promise.all([
    getEventConfig(),
    getProductMapping(),
    getSyncStatus(),
    getTicketTailorConfig(),
  ]);

  return (
    <>
      <TopNav active="Config" userEmail={session?.user?.email ?? ""} />

      <div className="bg-accent-tint border-b border-accent-border px-7 py-2.25 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C5DA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
            <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
          </svg>
          <span className="text-[12.5px] font-medium" style={{ color: "#1F4585" }}>
            {syncStatus.ok ? "Connected" : "Connection issue"} — {syncStatus.source}
          </span>
        </div>
      </div>

      <div className="px-7 pt-6.5 pb-8 flex flex-col gap-6.5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-semibold text-text">Events</div>
            <div className="text-xs text-text-faint">
              Read-only in this scaffold — edits persist once the app has a database (see README).
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1.3fr_1fr] px-5 h-9.5 bg-[#FAFBFC] border-b border-border items-center">
              <div className="text-[11px] font-bold text-text-faint tracking-wide">EVENT</div>
              <div className="text-[11px] font-bold text-text-faint tracking-wide">REGION</div>
              <div className="text-[11px] font-bold text-text-faint tracking-wide">MAX CAPACITY</div>
              <div className="text-[11px] font-bold text-text-faint tracking-wide">STATUS</div>
            </div>
            {eventConfig.map((c, i) => (
              <div
                key={c.event}
                className={`grid grid-cols-[2fr_1fr_1.3fr_1fr] px-5 h-13.5 items-center text-[13.5px] ${
                  i < eventConfig.length - 1 ? "border-b border-[#EEF0F3]" : ""
                }`}
              >
                <div className="font-medium text-text">{c.event}</div>
                <div className="text-text-muted">{c.region}</div>
                <div className="font-mono text-text">{c.maxCapacity}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-good-text" : "bg-text-faint"}`} />
                  <span className={`text-[12.5px] font-semibold ${c.status === "Active" ? "text-good-text" : "text-text-faint"}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="text-[15px] font-semibold text-text">Shopify product mapping</div>
            <div className="text-[12.5px] text-text-faint mt-0.5">
              Maps checkout product names to events — replaces the hardcoded list in the script.
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[2.4fr_1.6fr] px-5 h-9 bg-[#FAFBFC] border-b border-border items-center">
              <div className="text-[11px] font-bold text-text-faint tracking-wide">SHOPIFY PRODUCT</div>
              <div className="text-[11px] font-bold text-text-faint tracking-wide">MAPS TO EVENT(S)</div>
            </div>
            {productMapping.map((m, i) => (
              <div
                key={m.product}
                className={`grid grid-cols-[2.4fr_1.6fr] px-5 h-13 items-center text-[13.5px] ${
                  i < productMapping.length - 1 ? "border-b border-[#EEF0F3]" : ""
                }`}
              >
                <div className="text-text">{m.product}</div>
                <div className="flex gap-1.5">
                  {m.events.map((e) => (
                    <span key={e} className="inline-flex items-center bg-accent-tint text-accent rounded-md px-2.25 py-0.5 text-[11px] font-semibold">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[15px] font-semibold text-text">Guest categories</div>
          <div className="bg-surface border border-border rounded-xl p-4.5 flex items-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-text">Ticketing &amp; check-in</div>
              <div className="text-[12.5px] text-text-faint mt-0.5">
                Ticket Tailor integration. Issue QR tickets and pull check-in status back into the guest list. V2, off by default.
              </div>
            </div>
            <div className={`w-11 h-6.5 rounded-full p-0.75 flex items-center ${ticketTailor.connected ? "bg-accent justify-end" : "bg-border-strong justify-start"}`}>
              <div className="w-5 h-5 rounded-full bg-surface shadow" />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4.5 flex flex-col gap-3.5 opacity-50">
            <div className="flex items-center gap-1.75">
              <span className="w-1.5 h-1.5 rounded-full bg-text-faint" />
              <span className="text-[12.5px] font-semibold text-text-muted">
                {ticketTailor.connected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2.5 text-[13px] text-neutral-text">
                <span className="w-4 h-4 rounded border border-border-strong shrink-0" />
                Push new guests to Ticket Tailor as tickets
              </label>
              <label className="flex items-center gap-2.5 text-[13px] text-neutral-text">
                <span className="w-4 h-4 rounded border border-border-strong shrink-0" />
                Pull check-in status back into the guest list
              </label>
            </div>
            <button className="self-start h-8.5 px-3.5 bg-surface border border-border-strong rounded-lg text-[12.5px] font-semibold text-text-muted">
              Connect Ticket Tailor
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
