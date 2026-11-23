// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import { readFileSync } from "node:fs";

// The site's URL comes from the record (links.site, ADR 0008), so canonical URLs,
// robots.txt, the sitemap and og:image are right without a build variable. SITE_URL
// overrides it (for example, for a custom domain before the record changes).
const record = JSON.parse(readFileSync(new URL("./portfolio.json", import.meta.url), "utf8"));
const site = process.env.SITE_URL ?? record.links?.site ?? "https://example.invalid";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  vite: { plugins: [tailwindcss()] },
});
