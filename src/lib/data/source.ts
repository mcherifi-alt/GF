// Single entry point for reading guest data. Today it returns fixtures;
// once Edouard confirms the integration point (dedicated HubDB table vs.
// his existing Google Sheet — see synthese-v1.html section 03), only this
// file should change. Nothing upstream of this module may recompute
// extraction/dedup/scope logic — it only reads and returns.

import {
  ALL_GUESTS,
  EMPTY_DASHBOARD_ORGS,
  EVENT_CONFIG,
  PRODUCT_MAPPING,
  SYNC_DELTA,
  SYNC_STATUS,
  TICKET_TAILOR_CONFIG,
  UNMATCHED_SHOPIFY_ORDERS,
} from "@/lib/data/fixtures";
import type { EventName } from "@/lib/types";

export async function getGuests(event?: EventName) {
  if (!event) return ALL_GUESTS;
  return ALL_GUESTS.filter((g) => g.event === event);
}

export async function getEventConfig() {
  return EVENT_CONFIG;
}

export async function getProductMapping() {
  return PRODUCT_MAPPING;
}

export async function getEmptyDashboardOrgs() {
  return EMPTY_DASHBOARD_ORGS;
}

export async function getUnmatchedShopifyOrders() {
  return UNMATCHED_SHOPIFY_ORDERS;
}

export async function getSyncStatus() {
  return SYNC_STATUS;
}

export async function getSyncDelta() {
  return SYNC_DELTA;
}

export async function getTicketTailorConfig() {
  return TICKET_TAILOR_CONFIG;
}
