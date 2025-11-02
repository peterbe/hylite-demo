import { memo } from "react"
import type { SupportedLanguage } from "./types"

type Props = {
  language: string
  detectedLanguage?: string
  onSetLanguage: (language: string) => void
  languages: SupportedLanguage[]
}
export const LanguageSelect = memo(function LanguageSelect({
  onSetLanguage,
  detectedLanguage,
  language,
  languages,
}: Props) {
  return (
    <select value={language} onChange={(e) => onSetLanguage(e.target.value)}>
      <option value="">
        Auto-detect language {detectedLanguage && ` (${detectedLanguage})`}
      </option>
      {languages.map(({ codes, name }) => {
        const keep = keepCodes(name, codes)
        return (
          <option key={name} value={name}>
            {name} {keep.length > 0 && `(${keep.join(", ")})`}
          </option>
        )
      })}
    </select>
  )
})

function keepCodes(name: string, codes: string[]): string[] {
  const upper = name.toUpperCase()
  return codes.filter((code) => code.toUpperCase() !== upper)
}
