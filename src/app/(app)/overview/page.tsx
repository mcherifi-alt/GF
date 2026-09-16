import { auth } from "@/auth";
import { TopNav } from "@/components/TopNav";
import { OverviewClient } from "@/components/overview/OverviewClient";
import {
  getEmptyDashboardOrgs,
  getEventConfig,
  getGuests,
  getSyncDelta,
  getSyncStatus,
  getUnmatchedShopifyOrders,
} from "@/lib/data/source";

export default async function OverviewPage() {
  const session = await auth();
  const [guests, eventConfig, emptyDashboardOrgs, unmatchedOrders, syncStatus, syncDelta] = await Promise.all([
    getGuests(),
    getEventConfig(),
    getEmptyDashboardOrgs(),
    getUnmatchedShopifyOrders(),
    getSyncStatus(),
    getSyncDelta(),
  ]);

  return (
    <>
      <TopNav active="Overview" userEmail={session?.user?.email ?? ""} />
      <OverviewClient
        guests={guests}
        eventConfig={eventConfig}
        emptyDashboardOrgs={emptyDashboardOrgs}
        unmatchedOrders={unmatchedOrders}
        syncStatus={syncStatus}
        syncDelta={syncDelta}
      />
    </>
  );
}
