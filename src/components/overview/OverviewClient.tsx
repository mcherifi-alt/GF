"use client";

import { useMemo, useState } from "react";
import type {
  Category,
  EmptyDashboardOrg,
  EventConfig,
  EventName,
  Guest,
  SyncStatus,
  UnmatchedShopifyOrder,
} from "@/lib/types";

const CATEGORY_COLORS: Record<Category, string> = {
  Nominee: "#2C5DA8",
  Partner: "#1E9257",
  VIP: "#8354C4",
  "Ticket Holder": "#9AA1AC",
  "VIP Dinner": "#B15E12",
};

// Below this fill rate the event gets an explicit "low registration"
// vigilance flag — a number, not a magic default: see synthese-v1.html.
const LOW_REGISTRATION_THRESHOLD = 0.5;

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function OverviewClient({
  guests,
  eventConfig,
  emptyDashboardOrgs,
  unmatchedOrders,
  syncStatus,
  syncDelta,
}: {
  guests: Guest[];
  eventConfig: EventConfig[];
  emptyDashboardOrgs: EmptyDashboardOrg[];
  unmatchedOrders: UnmatchedShopifyOrder[];
  syncStatus: SyncStatus;
  syncDelta: { added: { count: number; event: string; sample: string }; removed: { count: number; event: string; sample: string } };
}) {
  const [capacities, setCapacities] = useState<Record<EventName, number>>(
    () => Object.fromEntries(eventConfig.map((c) => [c.event, c.maxCapacity])) as Record<EventName, number>,
  );
  const [editingEvent, setEditingEvent] = useState<EventName | null>(null);
  const [draftCapacity, setDraftCapacity] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventName>("Forum");
  const [remindedOrgs, setRemindedOrgs] = useState<Set<string>>(
    () => new Set(emptyDashboardOrgs.filter((o) => o.remindedOn).map((o) => o.submissionRowId)),
  );
  const [remindedOrders, setRemindedOrders] = useState<Set<string>>(
    () => new Set(unmatchedOrders.filter((o) => o.remindedOn).map((o) => o.email)),
  );

  const countByEvent = useMemo(() => {
    const m = new Map<EventName, number>();
    for (const c of eventConfig) m.set(c.event, guests.filter((g) => g.event === c.event).length);
    return m;
  }, [guests, eventConfig]);

  const breakdown = useMemo(() => {
    const rows = new Map<Category, number>();
    for (const g of guests.filter((x) => x.event === selectedEvent)) {
      rows.set(g.category, (rows.get(g.category) ?? 0) + 1);
    }
    const entries = [...rows.entries()].sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] ?? 1;
    return { entries, max };
  }, [guests, selectedEvent]);

  function saveCapacity(event: EventName) {
    const value = parseInt(draftCapacity, 10);
    if (!Number.isNaN(value) && value > 0) {
      setCapacities((prev) => ({ ...prev, [event]: value }));
    }
    setEditingEvent(null);
  }

  return (
    <div className="px-7 pt-6.5 pb-8 flex flex-col gap-6.5">
      <div className="bg-surface border border-border rounded-xl px-5.5 py-4 flex items-center">
        <div className="flex-1 flex items-center gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-good-bg flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1E7A46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text">
              +{syncDelta.added.count} new guests <span className="font-normal text-text-muted">since last sync</span>
            </div>
            <div className="text-xs text-text-faint">{syncDelta.added.event}: {syncDelta.added.sample}</div>
          </div>
        </div>
        <div className="w-px h-8.5 bg-border mx-6.5" />
        <div className="flex-1 flex items-center gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-danger-bg flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C23B4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text">
              &minus;{syncDelta.removed.count} guests <span className="font-normal text-text-muted">removed since last sync</span>
            </div>
            <div className="text-xs text-text-faint">{syncDelta.removed.event}: {syncDelta.removed.sample}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="text-[15px] font-semibold text-text">Event overview — {syncStatus.ok ? "synced" : "stale"}</div>
        <div className="grid grid-cols-4 gap-4.5">
          {eventConfig.map((c) => {
            const count = countByEvent.get(c.event) ?? 0;
            const capacity = capacities[c.event];
            const ratio = count / capacity;
            const soldOut = ratio >= 1;
            const low = ratio < LOW_REGISTRATION_THRESHOLD;
            const fillColor = soldOut ? "#C23B4B" : low ? "#B15E12" : "#1E9257";
            const isEditing = editingEvent === c.event;

            return (
              <div
                key={c.event}
                className={`bg-surface border rounded-xl p-5 flex flex-col gap-3 ${soldOut ? "border-danger-border" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-text-faint tracking-wide">{c.event.toUpperCase()}</div>
                  {soldOut && (
                    <div className="bg-danger-bg text-danger-text text-[10px] font-bold tracking-wide px-2 py-0.5 rounded">
                      SOLD OUT
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="font-mono text-[28px] font-medium text-text">{count}</div>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[13px] text-text-faint">/</span>
                      <input
                        autoFocus
                        value={draftCapacity}
                        onChange={(e) => setDraftCapacity(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveCapacity(c.event)}
                        className="w-14 h-6 border-1.5 border-accent rounded-md text-center font-mono text-[13px]"
                      />
                      <button onClick={() => saveCapacity(c.event)} className="text-good-text">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingEvent(c.event);
                        setDraftCapacity(String(capacity));
                      }}
                      className="font-mono text-[13px] text-text-faint flex items-center gap-1"
                    >
                      / {capacity} seats
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9AA1AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="h-2 bg-neutral-bg rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(ratio * 100, 100)}%`, background: fillColor }} />
                </div>
                {soldOut ? (
                  <div className="text-xs font-semibold text-danger-text">Capacity reached</div>
                ) : low ? (
                  <div className="flex items-center gap-1.25">
                    <AlertIcon color="#B15E12" />
                    <span className="text-xs font-semibold text-warn-text">
                      {Math.round(ratio * 100)}% full — low registration
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-text-muted">{Math.round(ratio * 100)}% full</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-neutral-bg rounded-lg p-1">
            {eventConfig.map((c) => (
              <button
                key={c.event}
                onClick={() => setSelectedEvent(c.event)}
                className={`px-3 py-1.5 rounded-md text-[13px] ${
                  selectedEvent === c.event ? "bg-surface shadow-sm font-semibold text-text" : "text-text-muted"
                }`}
              >
                {c.event}
              </button>
            ))}
          </div>
          <div className="text-[12.5px] text-text-faint">{countByEvent.get(selectedEvent) ?? 0} guests</div>
        </div>
        <div className="flex flex-col gap-3.5">
          {breakdown.entries.length === 0 ? (
            <div className="text-sm text-text-muted">No guests registered for {selectedEvent} yet.</div>
          ) : (
            breakdown.entries.map(([category, count]) => (
              <div key={category} className="grid grid-cols-[128px_1fr_46px] items-center gap-3.5">
                <div className="text-[13px] text-text-muted">{category}</div>
                <div className="h-3.5 bg-neutral-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / breakdown.max) * 100}%`, background: CATEGORY_COLORS[category] }}
                  />
                </div>
                <div className="font-mono text-[13px] text-text text-right">{count}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="text-[15px] font-semibold text-text">Needs attention</div>
        <div className="grid grid-cols-2 gap-4.5">
          <div className="bg-surface border border-l-4 border-border rounded-[10px] p-5.5 flex flex-col gap-3" style={{ borderLeftColor: "#E8A968" }}>
            <div className="flex items-center gap-2.5">
              <AlertIcon color="#B15E12" />
              <div className="font-mono text-[22px] font-medium text-text">{emptyDashboardOrgs.length}</div>
              <div className="text-sm font-semibold text-text">Nominees with an empty dashboard</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {emptyDashboardOrgs.map((org) => {
                const reminded = remindedOrgs.has(org.submissionRowId);
                return (
                  <div key={org.submissionRowId} className="flex items-center justify-between">
                    <span className="text-[13px] text-text-muted">{org.company}</span>
                    {reminded ? (
                      <span className="text-[11px] text-text-faint">Reminded</span>
                    ) : (
                      <button
                        onClick={() =>
                          setRemindedOrgs((prev) => new Set(prev).add(org.submissionRowId))
                        }
                        className="h-6.5 px-2.5 bg-surface border rounded-md text-[11px] font-semibold text-warn-text"
                        style={{ borderColor: "#E8A968" }}
                      >
                        Remind
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface border border-l-4 border-border rounded-[10px] p-5.5 flex flex-col gap-3" style={{ borderLeftColor: "#E8A968" }}>
            <div className="flex items-center gap-2.5">
              <AlertIcon color="#B15E12" />
              <div className="font-mono text-[22px] font-medium text-text">{unmatchedOrders.length}</div>
              <div className="text-sm font-semibold text-text">Shopify direct purchases, no guest list</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {unmatchedOrders.map((order) => {
                const reminded = remindedOrders.has(order.email);
                return (
                  <div key={order.email} className="flex items-center justify-between">
                    <span className="text-[13px] text-text-muted">{order.email}</span>
                    {reminded ? (
                      <span className="text-[11px] text-text-faint">Reminded</span>
                    ) : (
                      <button
                        onClick={() => setRemindedOrders((prev) => new Set(prev).add(order.email))}
                        className="h-6.5 px-2.5 bg-surface border rounded-md text-[11px] font-semibold text-warn-text"
                        style={{ borderColor: "#E8A968" }}
                      >
                        Remind
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
