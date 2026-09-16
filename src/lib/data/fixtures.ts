// Fixture data shaped exactly like the output of Edouard's
// generate-guest-csvs.js (First Name, Last Name, Job Title, Organization
// Name, Email, Category) plus Event. This is a stand-in for the real
// HubDB / Google Sheet read — see src/lib/data/source.ts for the single
// place that will be swapped once the integration point is confirmed.
// Never invent extraction/dedup logic here: this file only holds sample
// rows, no computation.

import type {
  EmptyDashboardOrg,
  EventConfig,
  Guest,
  ProductMapping,
  SyncStatus,
  UnmatchedShopifyOrder,
} from "@/lib/types";

export const FORUM_GUESTS: Guest[] = [
  { firstName: "Sarah", lastName: "Bennett", jobTitle: "VP Regulatory Affairs", organization: "Actavia Therapeutics", email: "sarah.bennett@actavia.example", category: "Nominee", event: "Forum" },
  { firstName: "Michael", lastName: "Byrne", jobTitle: "Chief Medical Officer", organization: "Solenna Biosciences", email: "michael.byrne@solenna.example", category: "VIP", event: "Forum" },
  { firstName: "Elena", lastName: "Carrasco", jobTitle: "Director of Access", organization: "Meridian Health Partners", email: "elena.carrasco@meridianhealth.example", category: "Partner", event: "Forum" },
  { firstName: "David", lastName: "Chen", jobTitle: "Head of Clinical Ops", organization: "Norvantis Pharma", email: "david.chen@norvantis.example", category: "Nominee", event: "Forum" },
  { firstName: "Anne", lastName: "Delacroix", jobTitle: "Program Lead", organization: "Fondation Galien Europe", email: "anne.delacroix@galienfoundation.example", category: "VIP", event: "Forum" },
  { firstName: "Paulo", lastName: "Ferreira", jobTitle: "Founder & CEO", organization: "BrightPath Diagnostics", email: "paulo.ferreira@brightpath.example", category: "Nominee", event: "Forum" },
  { firstName: "Olivia", lastName: "Grant", jobTitle: "Communications Manager", organization: "Meridian Health Partners", email: "olivia.grant@meridianhealth.example", category: "Partner", event: "Forum" },
  { firstName: "Youssef", lastName: "Haddad", jobTitle: "VP Market Access", organization: "Arclight Therapeutics", email: "youssef.haddad@arclight.example", category: "Nominee", event: "Forum" },
  { firstName: "Grace", lastName: "Kim", jobTitle: "Senior Scientist", organization: "Solenna Biosciences", email: "grace.kim@solenna.example", category: "Ticket Holder", event: "Forum" },
  { firstName: "Erik", lastName: "Lindqvist", jobTitle: "Chief Scientific Officer", organization: "Nordhelix Pharma", email: "erik.lindqvist@nordhelix.example", category: "VIP", event: "Forum" },
  { firstName: "Ben", lastName: "Mercer", jobTitle: "Chief Operating Officer", organization: "BrightPath Diagnostics", email: "ben.mercer@brightpath.example", category: "Ticket Holder", event: "Forum" },
  { firstName: "Amara", lastName: "Okafor", jobTitle: "Patient Advocacy Lead", organization: "Arclight Therapeutics", email: "amara.okafor@arclight.example", category: "Partner", event: "Forum" },
  { firstName: "Ivana", lastName: "Petrova", jobTitle: "Regulatory Counsel", organization: "Norvantis Pharma", email: "ivana.petrova@norvantis.example", category: "Ticket Holder", event: "Forum" },
  { firstName: "Luis", lastName: "Romero", jobTitle: "CEO", organization: "Meridian Health Partners", email: "luis.romero@meridianhealth.example", category: "VIP", event: "Forum" },
];

export const CEREMONY_GUESTS: Guest[] = FORUM_GUESTS.slice(0, 10).map((g) => ({ ...g, event: "Ceremony" }));

export const PATIENT_SUMMIT_GUESTS: Guest[] = FORUM_GUESTS.slice(0, 6).map((g) => ({
  ...g,
  event: "Patient Summit",
  category: "Ticket Holder",
}));

export const VIP_DINNER_GUESTS: Guest[] = FORUM_GUESTS.filter((g) => g.category === "VIP").map((g) => ({
  ...g,
  event: "VIP Dinner",
  category: "VIP Dinner",
}));

export const ALL_GUESTS: Guest[] = [
  ...FORUM_GUESTS,
  ...CEREMONY_GUESTS,
  ...PATIENT_SUMMIT_GUESTS,
  ...VIP_DINNER_GUESTS,
];

export const EVENT_CONFIG: EventConfig[] = [
  { event: "Forum", region: "USA", maxCapacity: 450, status: "Active" },
  { event: "Ceremony", region: "USA", maxCapacity: 320, status: "Active" },
  { event: "Patient Summit", region: "USA", maxCapacity: 400, status: "Active" },
  { event: "VIP Dinner", region: "USA", maxCapacity: 48, status: "Active" },
];

export const PRODUCT_MAPPING: ProductMapping[] = [
  { product: "Galien Forum USA 2026", events: ["Forum"] },
  { product: "Awards Ceremony USA 2026", events: ["Ceremony"] },
  { product: "Package Forum & Ceremony USA 2026", events: ["Forum", "Ceremony"] },
  { product: "Individual Ticket to the Galien Patient Summit", events: ["Patient Summit"] },
  { product: "Individual Ticket to the Galien Patient Summit (Non-Profit/PAG)", events: ["Patient Summit"] },
];

export const EMPTY_DASHBOARD_ORGS: EmptyDashboardOrg[] = [
  { company: "Solenna Biosciences", category: "Nominee", pocEmail: "poc@solenna.example", submissionRowId: "10231" },
  { company: "Arclight Therapeutics", category: "Nominee", pocEmail: "poc@arclight.example", submissionRowId: "10244", remindedOn: "2026-09-10" },
  { company: "Nordhelix Pharma", category: "Nominee", pocEmail: "poc@nordhelix.example", submissionRowId: "10256" },
];

export const UNMATCHED_SHOPIFY_ORDERS: UnmatchedShopifyOrder[] = [
  { email: "sophie.laurent@meridianhealth.example", name: "Sophie Laurent", company: "Meridian Health Partners", products: "Galien Forum USA 2026", orders: 1, firstPurchase: "2026-09-02" },
  { email: "t.owen@melink.example", name: "Ted Owen", company: "Melink", products: "Awards Ceremony USA 2026", orders: 1, firstPurchase: "2026-09-05" },
  { email: "r.cardiel@perspectum.example", name: "R. Cardiel", company: "Perspectum", products: "Galien Forum USA 2026", orders: 1, firstPurchase: "2026-09-08", remindedOn: "2026-09-11" },
];

export const SYNC_STATUS: SyncStatus = {
  lastSyncAt: "2026-09-15T14:32:00-04:00",
  ok: true,
  source: "event_guest_lists (fixture — real source pending Edouard's answer)",
};

export const SYNC_DELTA = {
  added: { count: 8, event: "Forum", sample: "Grace Kim, Erik Lindqvist +6 more" },
  removed: { count: 3, event: "Ceremony", sample: "Youssef Haddad, Anne Delacroix +1 more" },
};
