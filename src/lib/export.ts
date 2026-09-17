"use client";

import type { Guest } from "@/lib/types";

const HEADERS = ["First Name", "Last Name", "Job Title", "Organization Name", "Email", "Category"];

// Guest fields come from public signup forms (Edouard's pipeline), so
// treat them as untrusted. Excel/Sheets run a cell starting with
// =, +, -, @, tab or CR as a formula — prefix with an apostrophe so it
// opens as plain text instead (classic CSV-injection guard).
function neutralizeFormula(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function escapeCsv(value: string) {
  const safe = neutralizeFormula(value);
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(guests: Guest[]) {
  return guests.map((g) => [g.firstName, g.lastName, g.jobTitle, g.organization, g.email, g.category]);
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportCsv(guests: Guest[], filename: string) {
  const lines = [HEADERS, ...rows(guests)].map((r) => r.map(escapeCsv).join(","));
  download(filename, lines.join("\n") + "\n", "text/csv;charset=utf-8");
}

// Dependency-free Excel export: Excel opens an HTML table saved with an
// .xls extension. Good enough for a guest list; revisit only if real
// formatting (formulas, multiple sheets) is ever needed.
export function exportExcel(guests: Guest[], filename: string) {
  const headerRow = `<tr>${HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>`;
  const bodyRows = rows(guests)
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(neutralizeFormula(c))}</td>`).join("")}</tr>`)
    .join("");
  const html = `<html><head><meta charset="utf-8"></head><body><table>${headerRow}${bodyRows}</table></body></html>`;
  download(filename, html, "application/vnd.ms-excel");
}

export function printList() {
  window.print();
}
