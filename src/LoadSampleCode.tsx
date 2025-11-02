import { useState } from "react"
import useSWR from "swr"
import codeSamples from "./_code-samples.json"

const cache = new Map<string, string>()

export function LoadSampleCode({
  onLoad,
}: {
  onLoad: (code: string, language: string) => void
}) {
  const [url, setUrl] = useState<string | null>(null)

  const url2language = new Map<string, string>()
  for (const sample of codeSamples.samples) {
    url2language.set(sample.url, sample.language)
  }

  const { error, isLoading } = useSWR(
    url,
    async (url) => {
      const cached = cache.get(url)
      if (cached) {
        return cached
      }
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Failed to fetch user data")
      }
      return res.text()
    },
    {
      onSuccess: (data) => {
        const language = url ? url2language.get(url) || "" : ""
        if (url) cache.set(url, data)
        if (language) {
          onLoad(data, language)
        }
      },
    },
  )

  return (
    <div className="grid">
      {error && <div className="error">Error loading sample code</div>}
      <select
        disabled={isLoading}
        name="sample-code"
        aria-label="Load sample code..."
        defaultValue=""
        aria-busy={isLoading && "true"}
        onChange={(event) => {
          const selectedUrl = event.currentTarget.value
          if (!selectedUrl) return
          setUrl(selectedUrl)
        }}
      >
        <option disabled value="">
          Load sample code...
        </option>
        {codeSamples.samples.map(({ language, name, url }) => (
          <option key={name} value={url}>
            {language} - {name}
          </option>
        ))}
      </select>
    </div>
  )
}
