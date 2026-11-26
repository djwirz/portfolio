import type { APIRoute } from "astro";
import { record, displayName, projects, projectSlug, STATUS_LABEL, statusOf, liveSkills } from "../lib/record";

// /llms.txt: the facts an assistant needs to answer a recruiter's question about Dan,
// in plain text, built from the record (VWC checklist, "AI Search Visibility").
export const GET: APIRoute = ({ site }) => {
  const { profile, links } = record;
  const url = (path: string) => new URL(path, site).href;
  const lines = [
    `# ${displayName}`,
    "",
    `> ${profile.headline}.`,
    "",
    `- Role: ${profile.target_role}`,
    `- Location: ${profile.location} (remote)`,
    ...(profile.availability ? [`- Availability: ${profile.availability}`] : []),
    `- Skills proven in public projects: ${liveSkills.join(", ")}`,
    ...(profile.email ? [`- Email: ${profile.email}`] : []),
    `- LinkedIn: ${links.linkedin}`,
    `- GitHub: ${links.github}`,
    "",
    profile.summary,
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.name}](${url(`/work/${projectSlug(p.name)}/`)}) (${STATUS_LABEL[statusOf(p)]}): ${p.one_liner}.${p.repo ? ` Code: ${p.repo}` : ""}`),
    "",
    "## Pages",
    `- [Recruiter fast lane](${url("/recruiters/")}): key facts and contact`,
    `- [Résumé](${url("/resume/")})`,
    `- [About](${url("/about/")})`,
    `- [How I build](${url("/how-i-build/")}): the method, including what went wrong`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
