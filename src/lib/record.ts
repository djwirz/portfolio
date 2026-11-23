// The record, parsed and checked at build time. Anything here that throws fails
// `astro build`, so a broken record or private data can't reach a page (spec §10, ADR 0007).
import { z } from "zod";
import raw from "../../portfolio.json";
import { parseBrag, slug, type BragFile } from "./brag";

const Backs = z.object({ story: z.string(), org: z.string(), label: z.string() });

const Project = z.looseObject({
  name: z.string(),
  one_liner: z.string(),
  status: z.enum(["live", "building", "planned", "next"]).optional(),
  backs: z.array(Backs).default([]),
  url: z.string().default(""),
  repo: z.string().default(""),
  depth: z.number().int().min(0).max(4),
  skills: z.array(z.string()).default([]),
  evidence: z.array(z.string()).default([]),
  case_study: z.string().optional(),
});

const Record = z.looseObject({
  profile: z.looseObject({
    name: z.string(),
    preferred_name: z.string().optional(),
    headline: z.string(),
    target_role: z.string(),
    summary: z.string(),
    location: z.string(),
    email: z.string().optional(),
    availability: z.string().optional(),
  }),
  links: z.looseObject({
    site: z.string().optional(),
    github: z.string(),
    linkedin: z.string(),
  }),
  experience: z.array(
    z.looseObject({
      title: z.string(),
      org: z.string(),
      start: z.string(),
      end: z.string(),
      highlights: z.array(z.string()).default([]),
    }),
  ),
  artifacts: z.array(Project).default([]),
  in_flight: z.array(Project).default([]),
  education_line: z.string().optional(),
});

export type Project = z.infer<typeof Project>;

// Raw text of the mirrored files, read at build time.
const bragText = import.meta.glob<string>("../../brag/entries/*.md", { query: "?raw", import: "default", eager: true });
const storyText = import.meta.glob<string>("../../case-studies/*.md", { query: "?raw", import: "default", eager: true });

const base = (path: string) => path.split("/").pop() ?? path;
const PHONE = /\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/;

function phoneKeys(value: unknown, path = "portfolio.json"): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => phoneKeys(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => [
      ...(/phone/i.test(k) ? [`${path}.${k}`] : []),
      ...phoneKeys(v, `${path}.${k}`),
    ]);
  }
  return [];
}

function load() {
  const parsed = Record.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`portfolio.json doesn't match its schema:\n${z.prettifyError(parsed.error)}`);
  }
  const record = parsed.data;
  const problems: string[] = [];

  // Privacy (ADR 0005, spec §10): no phone number anywhere in the record.
  for (const key of phoneKeys(raw)) problems.push(`${key}: no phone numbers in the record (ADR 0005)`);
  const texts: [string, string][] = [
    ["portfolio.json", JSON.stringify(raw)],
    ...Object.entries(bragText),
    ...Object.entries(storyText),
  ];
  for (const [path, text] of texts) {
    if (PHONE.test(text)) problems.push(`${base(path)}: looks like it contains a phone number`);
  }

  // Only curated brag entries are mirrored (raw pulls stay in brag/inbox, which is git-ignored).
  const brag: BragFile[] = Object.entries(bragText).map(([path, text]) => parseBrag(base(path), text));
  for (const b of brag) {
    if (b.status !== "curated") problems.push(`brag/entries/${b.file}: status is "${b.status || "missing"}", expected "curated"`);
  }

  // Every highlight ref resolves to a ### heading (file#slug), as the kit expects.
  const anchors = new Set(brag.flatMap((b) => b.items.map((i) => `${b.file}#${i.anchor}`)));
  for (const job of record.experience) {
    for (const ref of job.highlights) {
      if (!anchors.has(base(ref))) problems.push(`${job.title} at ${job.org}: highlight "${ref}" has no matching brag heading`);
    }
  }

  // Projects (ADR 0006): live work in artifacts, everything else in in_flight; backs point at real stories.
  const stories = new Set(Object.keys(storyText).map((p) => base(p).replace(/\.md$/, "")));
  for (const a of record.artifacts) {
    if (a.status !== "live" || a.depth < 2) problems.push(`artifacts: ${a.name} must be status "live" at depth 2 or more (ADR 0006)`);
  }
  for (const p of record.in_flight) {
    if (!p.status || p.status === "live" || p.depth > 1) problems.push(`in_flight: ${p.name} must be building, planned or next, at depth 0 or 1 (ADR 0006)`);
  }
  for (const p of [...record.artifacts, ...record.in_flight]) {
    for (const b of p.backs) {
      if (!stories.has(b.story)) problems.push(`${p.name}: backs "${b.story}", but there's no case-studies/${b.story}.md`);
    }
  }

  for (const a of record.artifacts) {
    const file = a.case_study ? base(a.case_study).replace(/\.md$/, "") : "";
    if (file && !stories.has(file)) problems.push(`artifacts: ${a.name}'s case_study "${a.case_study}" doesn't exist`);
  }

  if (problems.length) throw new Error(`The record has problems:\n- ${problems.join("\n- ")}`);
  return { record, brag };
}

export const { record, brag } = load();

/** "Dan Wirz" from preferred_name and the last part of the full name. */
export const displayName = record.profile.preferred_name
  ? `${record.profile.preferred_name} ${record.profile.name.split(" ").pop()}`
  : record.profile.name;

// --- Projects and stories, for the pages (spec §5) ---

const STATUS_ORDER = { live: 0, building: 1, planned: 2, next: 3 } as const;
export const STATUS_LABEL = { live: "Live", building: "Building", planned: "Planned", next: "Next" } as const;
export type Status = keyof typeof STATUS_LABEL;

export const projectSlug = (name: string) => slug(name);
export const statusOf = (p: Project): Status => p.status ?? "planned";

/** Live projects first, then building, planned, next; lineup order within each. */
export const projects: Project[] = [...record.artifacts, ...record.in_flight]
  .map((p, i) => ({ p, i }))
  .sort((a, b) => STATUS_ORDER[statusOf(a.p)] - STATUS_ORDER[statusOf(b.p)] || a.i - b.i)
  .map(({ p }) => p);

/** Case-study file names (without .md) that are project deep dives, not employer stories. */
export const projectStories = new Set(
  projects.flatMap((p) => (p.case_study ? [base(p.case_study).replace(/\.md$/, "")] : [])),
);

/** Projects whose "backs" names this employer story. */
export const backedBy = (story: string) => projects.filter((p) => p.backs.some((b) => b.story === story));

/** A case study's title: its first "# " line. */
export const caseStudyTitle = (body: string | undefined) => /^#\s+(.+)$/m.exec(body ?? "")?.[1].trim() ?? "";
