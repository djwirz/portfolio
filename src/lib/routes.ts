// Every page on the site, for sitemap.xml. The kit's portfolio scorer fetches
// /sitemap.xml at the host root, so it's one file rather than a sitemap index.
// Static pages are listed here; pages built from the record are derived from it.
import { projects, projectSlug, projectStories } from "./record";

const storyFiles = import.meta.glob("../../case-studies/*.md");
const stories = Object.keys(storyFiles)
  .map((p) => (p.split("/").pop() ?? "").replace(/\.md$/, ""))
  .filter((s) => !projectStories.has(s));

export const routes: string[] = [
  "/",
  "/work/",
  "/resume/",
  "/recruiters/",
  "/about/",
  "/contact/",
  "/how-i-build/",
  "/reading/",
  "/refer/",
  ...projects.map((p) => `/work/${projectSlug(p.name)}/`),
  ...stories.map((s) => `/experience/${s}/`),
];
