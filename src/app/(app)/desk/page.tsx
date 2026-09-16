import { auth } from "@/auth";
import { TopNav } from "@/components/TopNav";
import { DeskClient } from "@/components/desk/DeskClient";
import { getEventConfig, getGuests, getSyncStatus } from "@/lib/data/source";

export default async function DeskPage() {
  const session = await auth();
  const [guests, eventConfig, syncStatus] = await Promise.all([
    getGuests(),
    getEventConfig(),
    getSyncStatus(),
  ]);

  return (
    <>
      <TopNav active="Desk" userEmail={session?.user?.email ?? ""} />
      <DeskClient guests={guests} eventConfig={eventConfig} syncStatus={syncStatus} />
    </>
  );
}
