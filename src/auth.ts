import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// In production this comes from the Google Workspace tenant already used
// for HubSpot's own SSO — see synthese-v1.html, section 04.
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN ?? "galienfoundation.org";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const email = (profile?.email ?? "").toLowerCase();
      // email_verified matters here: without it, an unverified address
      // claiming to be @galienfoundation.org would pass the suffix check.
      const verified = profile?.email_verified === true;
      return verified && email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
  },
});
