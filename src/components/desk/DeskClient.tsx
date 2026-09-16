"use client";

import { useMemo, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { exportCsv, exportExcel, printList } from "@/lib/export";
import { fuzzyMatchScore } from "@/lib/fuzzy";
import type { EventConfig, EventName, Guest, SyncStatus } from "@/lib/types";

const EVENTS: EventName[] = ["Forum", "Ceremony", "Patient Summit", "VIP Dinner"];

function formatSyncTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DeskClient({
  guests,
  eventConfig,
  syncStatus,
}: {
  guests: Guest[];
  eventConfig: EventConfig[];
  syncStatus: SyncStatus;
}) {
  const [activeEvent, setActiveEvent] = useState<EventName>("Forum");
  const [query, setQuery] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const eventGuests = useMemo(
    () =>
      guests
        .filter((g) => g.event === activeEvent)
        .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)),
    [guests, activeEvent],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return eventGuests;
    const q = query.toLowerCase();
    return eventGuests.filter((g) => `${g.firstName} ${g.lastName}`.toLowerCase().includes(q));
  }, [eventGuests, query]);

  const suggestion = useMemo(() => {
    if (!query.trim() || filtered.length > 0) return null;
    let best: { guest: Guest; score: number } | null = null;
    for (const g of eventGuests) {
      const score = fuzzyMatchScore(query, `${g.firstName} ${g.lastName}`);
      if (score <= 3 && (!best || score < best.score)) best = { guest: g, score };
    }
    return best?.guest ?? null;
  }, [query, eventGuests, filtered.length]);

  const soldOut = eventConfig.some((c) => {
    const count = guests.filter((g) => g.event === c.event).length;
    return count >= c.maxCapacity;
  });

  let lastLetter = "";
  const exportName = (ext: string) => `${activeEvent.replace(/\s+/g, "-")}.${ext}`;

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-accent-tint border-b border-accent-border px-7 py-2.25 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C5DA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
          <span className="text-[12.5px] font-medium" style={{ color: "#1F4585" }}>
            Data current as of {formatSyncTime(syncStatus.lastSyncAt)}
          </span>
          <span className="text-[12.5px]" style={{ color: "#6E8FBE" }}>·</span>
          <span className="text-[12.5px]" style={{ color: "#5B7EAE" }}>Synced from {syncStatus.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3C6BA3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="text-xs font-medium" style={{ color: "#3C6BA3" }}>Available offline</span>
        </div>
      </div>

      <div className="px-7 pt-5.5 pb-8 flex flex-col gap-4.5 flex-1">
        <div className="flex items-center gap-1 bg-neutral-bg rounded-[10px] p-1 w-fit no-print">
          {EVENTS.map((event) => (
            <button
              key={event}
              onClick={() => {
                setActiveEvent(event);
                setQuery("");
              }}
              className={`px-4.5 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                event === activeEvent ? "bg-surface shadow-sm font-semibold text-accent" : "font-medium text-text-muted"
              }`}
            >
              {event}
              {soldOut && event === "VIP Dinner" && <span className="w-1.5 h-1.5 rounded-full bg-danger-text" />}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between no-print">
          <div className="relative">
            <div className="w-[420px] h-11 bg-surface border border-border-strong rounded-[10px] flex items-center gap-2.5 px-3.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA1AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name…"
                className="flex-1 text-sm outline-none placeholder:text-text-faint"
              />
            </div>
            {suggestion && (
              <div className="absolute top-12 left-0 w-[420px] bg-surface border border-border rounded-[10px] shadow-lg p-2 z-10">
                <div className="text-[11px] font-semibold text-text-faint tracking-wide px-2 pt-1 pb-1.5">
                  DID YOU MEAN
                </div>
                <button
                  onClick={() => setQuery(`${suggestion.firstName} ${suggestion.lastName}`)}
                  className="w-full flex items-center justify-between rounded-md p-2 bg-[#F5F8FC] text-left"
                >
                  <div>
                    <div className="text-[13.5px] font-medium text-text">
                      {suggestion.lastName}, {suggestion.firstName}
                    </div>
                    <div className="text-xs text-text-muted">{suggestion.organization}</div>
                  </div>
                  <CategoryBadge category={suggestion.category} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13.5px] text-text-muted">{eventGuests.length} registered guests</span>
            <div className="relative">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="h-10 bg-accent-tint border border-accent-border rounded-lg flex items-center gap-2 px-4 text-[13.5px] font-medium text-accent"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2C5DA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M4 21h16" />
                </svg>
                Export
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2C5DA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {exportOpen && (
                <div className="absolute top-12 right-0 w-[212px] bg-surface border border-border rounded-[10px] shadow-lg p-1.5 z-10">
                  <button
                    onClick={() => {
                      exportCsv(eventGuests, exportName("csv"));
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-text text-left"
                  >
                    <span className="w-8.5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-accent-tint text-accent">CSV</span>
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      exportExcel(eventGuests, exportName("xls"));
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-text text-left"
                  >
                    <span className="w-8.5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-good-bg text-good-text">XLS</span>
                    Export as Excel
                  </button>
                  <button
                    onClick={() => {
                      printList();
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-text text-left border-t border-neutral-bg mt-0.5 pt-3"
                  >
                    <span className="w-8.5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-warn-bg text-warn-text">PDF</span>
                    Export / Print as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2.1fr_1.7fr_1.7fr_1fr] px-7 h-9.5 bg-[#FAFBFC] border-b border-border items-center">
            <div className="text-[11px] font-bold text-text-faint tracking-wide">NAME</div>
            <div className="text-[11px] font-bold text-text-faint tracking-wide">ORGANIZATION</div>
            <div className="text-[11px] font-bold text-text-faint tracking-wide">JOB TITLE</div>
            <div className="text-[11px] font-bold text-text-faint tracking-wide">CATEGORY</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-7 py-14 text-center">
              <div className="text-sm font-medium text-text">No one found for &ldquo;{query}&rdquo;</div>
              <div className="text-[13px] text-text-muted mt-1">
                Double-check the spelling, or confirm with the organizer before turning anyone away.
              </div>
            </div>
          ) : (
            filtered.map((g) => {
              const letter = g.lastName.charAt(0).toUpperCase();
              const showLetter = letter !== lastLetter && !query.trim();
              lastLetter = letter;
              return (
                <div key={g.email + g.firstName}>
                  {showLetter && (
                    <div className="px-7 pt-2 pb-1 text-[11px] font-bold text-text-faint tracking-wide bg-[#FAFBFC]">
                      {letter}
                    </div>
                  )}
                  <div className="grid grid-cols-[2.1fr_1.7fr_1.7fr_1fr] px-7 h-11.5 border-b border-[#EEF0F3] items-center text-sm last:border-b-0">
                    <div className="font-medium text-text">
                      {g.lastName}, {g.firstName}
                    </div>
                    <div className="text-text-muted">{g.organization}</div>
                    <div className="text-text-faint">{g.jobTitle}</div>
                    <div>
                      <CategoryBadge category={g.category} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
