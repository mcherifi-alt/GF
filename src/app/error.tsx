"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#EEF1F5] flex items-center justify-center">
      <div className="w-[420px] bg-surface border border-border rounded-2xl px-10 py-11 flex flex-col items-center gap-5 shadow-sm">
        <div className="w-10 h-10 rounded-[10px] bg-danger-bg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A82F41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="text-[17px] font-semibold text-text">Something went wrong</div>
          <div className="text-[13px] text-text-muted leading-relaxed">
            The guest list itself hasn&rsquo;t changed, this screen just failed to load. Try again, or come back in a moment.
          </div>
        </div>
        <button
          onClick={retry}
          className="h-10 px-5 bg-accent rounded-lg text-[13.5px] font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
