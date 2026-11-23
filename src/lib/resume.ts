// The résumé as a view of the record (spec §5): experience with its highlighted brag
// entries, live projects only (ADR 0006), skills from both, education. No phone (ADR 0005).
import { brag, record } from "./record";
import type { BragItem } from "./brag";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-05" → "May 2025"; "present" → "Present" (the kit's nice_date). */
export function niceDate(d: string): string {
  if (/^(present|current|now)$/i.test(d.trim())) return "Present";
  const m = /^(\d{4})-(\d{2})$/.exec(d.trim());
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : d;
}

const items = new Map<string, BragItem>(brag.flatMap((b) => b.items.map((i): [string, BragItem] => [`${b.file}#${i.anchor}`, i])));

export interface ResumeJob {
  title: string;
  org: string;
  location: string;
  dates: string;
  bullets: BragItem[];
}

export const jobs: ResumeJob[] = [...record.experience]
  .sort((a, b) => b.start.localeCompare(a.start))
  .map((e) => ({
    title: e.title,
    org: e.org,
    location: typeof e.location === "string" ? e.location : "",
    dates: `${niceDate(e.start)} – ${niceDate(e.end)}`,
    // The record check already fails the build on a ref that doesn't resolve.
    bullets: e.highlights.map((h) => items.get(h.split("/").pop() ?? h)).filter((i): i is BragItem => Boolean(i)),
  }));

export const projects = record.artifacts;

// The same skill under two names in the brag entries.
const ALIAS: { [name: string]: string } = { DynamoDB: "Amazon DynamoDB", "Stripe API": "Stripe" };
const canonical = (s: string) => ALIAS[s] ?? s;

/**
 * Skills: everything the live projects prove, then work-history skills that recur in at
 * least two highlighted entries, most used first. A skill named once stays in its bullet
 * rather than padding the list.
 */
const counts = new Map<string, number>();
for (const b of jobs.flatMap((j) => j.bullets)) {
  for (const s of new Set(b.skills.map(canonical))) counts.set(s, (counts.get(s) ?? 0) + 1);
}
const recurring = [...counts].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([s]) => s);
export const skills: string[] = [...new Set([...projects.flatMap((p) => p.skills.map(canonical)), ...recurring])];
