import { basename, join } from "node:path"
import { Glob } from "bun"

async function main() {
  const glob = new Glob("*.css")

  const scan = glob.scan({
    cwd: "node_modules/highlight.js/styles",
    absolute: true,
  })
  const outDir = join(import.meta.dir, "..", "dist", "styles")
  for await (const filePath of scan) {
    if (filePath.endsWith(".min.css")) continue
    const file = Bun.file(filePath)
    await Bun.write(join(outDir, basename(filePath)), file)
  }
}

main()
