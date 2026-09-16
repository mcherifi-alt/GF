export type EventName = "Forum" | "Ceremony" | "Patient Summit" | "VIP Dinner";

export type Category = "Nominee" | "Partner" | "VIP" | "Ticket Holder" | "VIP Dinner";

export interface Guest {
  firstName: string;
  lastName: string;
  jobTitle: string;
  organization: string;
  email: string;
  category: Category;
  event: EventName;
}

export interface EventConfig {
  event: EventName;
  region: string;
  maxCapacity: number;
  status: "Active" | "Draft";
}

export interface ProductMapping {
  product: string;
  events: EventName[];
}

export interface EmptyDashboardOrg {
  company: string;
  category: string;
  pocEmail: string;
  submissionRowId: string;
  remindedOn?: string;
}

export interface UnmatchedShopifyOrder {
  email: string;
  name: string;
  company: string;
  products: string;
  orders: number;
  firstPurchase: string;
  remindedOn?: string;
}

export interface SyncStatus {
  lastSyncAt: string;
  ok: boolean;
  source: string;
}
