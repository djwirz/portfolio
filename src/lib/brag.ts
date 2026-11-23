// A minimal reader for the kit's curated brag entries (brag/entries/*.md):
//   ---  front matter with status  ---
//   ## Org
//   ### Accomplishment
//   - Impact: ...   - Skills: a, b   - Portfolio artifact: ...   - Proof: ...

/** The kit's slug rule (resume_rebuild.py's slug()), so highlight refs match. */
export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export interface BragItem {
  file: string;
  anchor: string;
  org: string;
  what: string;
  impact: string;
  skills: string[];
  artifact: string;
  proof: string;
}

export interface BragFile {
  file: string;
  status: string;
  items: BragItem[];
}

export function parseBrag(file: string, text: string): BragFile {
  const status = /^status:\s*(\S+)/m.exec(text)?.[1] ?? "";
  const items: BragItem[] = [];
  let org = "";
  let cur: BragItem | undefined;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      org = line.slice(3).trim();
    } else if (line.startsWith("### ")) {
      const what = line.slice(4).trim();
      cur = { file, anchor: slug(what), org, what, impact: "", skills: [], artifact: "", proof: "" };
      items.push(cur);
    } else if (cur) {
      const m = /^\s*-\s*(Impact|Skills|Portfolio artifact|Proof):\s*(.*)$/i.exec(line);
      if (!m) continue;
      const key = m[1].toLowerCase();
      const value = m[2].trim();
      if (key === "impact") cur.impact = value;
      else if (key === "skills") cur.skills = value.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      else if (key === "portfolio artifact") cur.artifact = value;
      else cur.proof = value;
    }
  }
  return { file, status, items };
}
