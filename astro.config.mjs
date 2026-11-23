// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// SITE_URL is set once the site is deployed (spec §13, slice 4). The placeholder keeps
// canonical URLs, robots.txt and the sitemap well-formed until then; replacing it is a
// go-live item (spec §14).
const site = process.env.SITE_URL ?? "https://portfolio-placeholder.pages.dev";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  vite: { plugins: [tailwindcss()] },
});
