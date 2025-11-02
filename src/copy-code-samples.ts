import { basename, extname, join } from "node:path"
import { Glob } from "bun"

const ext2LanguageMap: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  py: "Python",
  java: "Java",
  cpp: "C++",
  cs: "C#",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  php: "PHP",
  swift: "Swift",
  kt: "Kotlin",
  scala: "Scala",
  sh: "Shell",
  bash: "Bash",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
  basic: "BASIC",
}

async function main() {
  const glob = new Glob("*.*")

  const cwd = join(import.meta.dir, "..", "code-samples")
  const scan = glob.scan({
    cwd,
    absolute: true,
  })
  const outDir = join(import.meta.dir, "..", "dist", "code-samples")
  const registry: {
    url: string
    language: string
    name: string
  }[] = []
  for await (const filePath of scan) {
    const file = Bun.file(filePath)
    await Bun.write(join(outDir, basename(filePath)), file)

    const ext = extname(filePath).slice(1)

    const language = ext2LanguageMap[ext]
    if (language === undefined) {
      throw new Error(
        `Unknown extension: ${ext}. Not one of of ${Object.keys(
          ext2LanguageMap,
        ).join(", ")}`,
      )
    }
    registry.push({
      url: `/code-samples/${basename(filePath)}`,
      language,
      name: basename(filePath),
    })
  }
  registry.sort((a, b) => {
    const cmp = a.language.localeCompare(b.language)
    if (cmp === 0) {
      return a.name.localeCompare(b.name)
    }
    return cmp
  })
  const out = Bun.file(join(import.meta.dir, "_code-samples.json"))
  await out.write(JSON.stringify({ samples: registry }, null, 2))
}

main()
