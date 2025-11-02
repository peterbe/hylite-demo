import { join } from "node:path"

async function main() {
  const aliases = await getAliasesFromDocs()
  const languages: {
    name: string
    codes: string[]
  }[] = []
  for (const [name, codes] of aliases) {
    languages.push({ name, codes })
  }
  const out = Bun.file(join(import.meta.dir, "_highlight-languages.json"))
  await out.write(JSON.stringify({ languages }, null, 2))
}

async function getAliasesFromDocs(): Promise<Map<string, string[]>> {
  const aliases = new Map<string, string[]>()
  const doc = Bun.file("node_modules/highlight.js/SUPPORTED_LANGUAGES.md")
  let payload = await doc.text()
  const start = payload.split("<!-- LANGLIST -->")
  if (!start[1]) {
    throw new Error("Couldn't find langlist markers in SUPPORTED_LANGUAGES.md")
  }
  payload = start[1]
  const end = payload.split("<!-- LANGLIST_END -->")
  if (!end[0]) {
    throw new Error(
      "Couldn't find langlist end marker in SUPPORTED_LANGUAGES.md",
    )
  }
  payload = end[0]
  for (const line of payload.split("\n")) {
    if (line.startsWith("|") && /\s\|\s/.test(line)) {
      const split = line.split("|").map((s) => s.trim())
      if (split.length >= 3) {
        const name = split[1]
        if (name === "Language") continue // header row
        if (name?.startsWith(":-----")) continue // divider row
        if (split[3]?.trim()) continue // needs extract external package

        const codes = (split[2] || "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
        if (name && codes.length > 0) {
          aliases.set(name, codes)
        }
      }
    }
  }
  return aliases
}

main()
