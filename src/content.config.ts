import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The mirrored case studies (employer stories and project deep dives). They have no
// front matter; each title is the file's first "# " line (see caseStudyTitle).
const caseStudies = defineCollection({
  loader: glob({ pattern: "*.md", base: "./case-studies" }),
});

// Recent reads and thoughts on them, for /reading/. Site content written in this repo,
// not part of the mirrored career record. Files starting with "_" (the example) are
// never published.
const reading = defineCollection({
  loader: glob({ pattern: "[!_]*.md", base: "./reading" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    kind: z.enum(["technical", "thought-provoking"]),
    read: z.string().regex(/^\d{4}-\d{2}$/, "read is a year and month, like 2026-11"),
    link: z.url().optional(),
  }),
});

export const collections = { caseStudies, reading };
