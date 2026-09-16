import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Defense in depth: proxy.ts does the optimistic redirect, this is the
// real check close to the data (see Next.js authentication guide, DAL).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return <div className="min-h-screen bg-bg flex flex-col">{children}</div>;
}
