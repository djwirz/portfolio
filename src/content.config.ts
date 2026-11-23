import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// The mirrored case studies (employer stories and project deep dives). They have no
// front matter; each title is the file's first "# " line (see caseStudyTitle).
export const collections = {
  caseStudies: defineCollection({
    loader: glob({ pattern: "*.md", base: "./case-studies" }),
  }),
};
