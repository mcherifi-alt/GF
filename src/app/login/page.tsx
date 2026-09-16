import { signIn } from "@/auth";

// Fallback screen only — the normal path is the HubSpot nav link, which
// carries an already-active SSO session through transparently. See
// synthese-v1.html section 04/05.
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#EEF1F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-[420px] bg-surface border border-border rounded-2xl px-10 py-11 flex flex-col items-center gap-7 shadow-sm">
          <div className="flex flex-col items-center gap-3.5">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#EAF1FB" stroke="#D6E3F5" />
              <rect x="11" y="13" width="18" height="3" rx="1.5" fill="#2C5DA8" />
              <rect x="11" y="19" width="14" height="3" rx="1.5" fill="#2C5DA8" opacity="0.7" />
              <rect x="11" y="25" width="10" height="3" rx="1.5" fill="#2C5DA8" opacity="0.45" />
            </svg>
            <div className="flex flex-col items-center gap-1.5">
              <div className="text-[19px] font-semibold text-text tracking-tight">Galien Guest Lists</div>
              <div className="text-[13px] text-text-muted text-center leading-relaxed">
                Guest list console for Forum, Patient Summit,
                <br />
                Ceremony &amp; VIP Dinner
              </div>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/desk" });
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full h-11.5 bg-surface border border-border-strong rounded-lg flex items-center justify-center gap-3 text-[14px] font-medium text-text"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="text-[12.5px] text-text-faint text-center">
            Access restricted to <span className="text-text-muted font-medium">@galienfoundation.org</span> accounts
          </div>
        </div>
        <div className="text-xs text-text-faint">Internal tool — Fondation Galien</div>
      </div>
    </div>
  );
}
