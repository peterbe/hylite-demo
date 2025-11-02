import { join } from "node:path"
import { Glob } from "bun"

async function main() {
  const glob = new Glob("*.css")

  const cwd = "node_modules/highlight.js/styles"
  const scan = glob.scan({
    cwd,
    absolute: false,
  })
  const styles: string[] = []
  for await (const fileName of scan) {
    if (fileName.endsWith(".min.css")) continue
    if (fileName.endsWith("pojoaque.css")) continue // depends on a background jpg
    if (fileName.endsWith("brown-paper.css")) continue // depends on a background jpg
    styles.push(fileName)
  }
  styles.sort()
  const out = Bun.file(join(import.meta.dir, "_highlight-styles.json"))
  await out.write(JSON.stringify({ styles }, null, 2))
}

main()
