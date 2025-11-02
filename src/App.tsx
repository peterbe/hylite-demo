import DOMPurify from "dompurify"
import hljs from "highlight.js"
// import logo from "./logo.svg"
// import reactLogo from "./react.svg";
import { useMemo, useState } from "react"
import { useSessionStorage } from "usehooks-ts"
import supportedLanguages from "./_highlight-languages.json"

import "./index.css"
// import styles from "./styles.module.css"
// CSS modules don't work with HMR, yet. See https://github.com/oven-sh/bun/issues/18258
// so for now, doing it the old-fashioned way.
import "./styles.css"
import { CssSelector } from "./CssSelector"
import { Header } from "./Header"
import { LanguageSelect } from "./LanguageSelect"
import { LoadSampleCode } from "./LoadSampleCode"

const MIN_ROWS = 5
const MAX_ROWS = 20

const DEFAULT_CODE = `function helloWorld() {
  console.log("Hello, world!");
}
`

export function App() {
  const [language, setLanguage] = useSessionStorage("language", "")

  const [code, setCode] = useSessionStorage("code", DEFAULT_CODE)
  const [codeDraft, setCodeDraft] = useState(code)

  const [textareaRows, setTextareaRows] = useState(MIN_ROWS)

  function adjustTextareaRows() {
    const lines = code.trim().split("\n").length
    const newRows = Math.min(Math.max(lines, MIN_ROWS), MAX_ROWS)
    setTextareaRows(newRows)
  }

  const [html, detectedLanguage] = useMemo(() => {
    let html: string | undefined
    let detectedLanguage: string | undefined
    if (code) {
      if (language) {
        html = hljs.highlight(code, { language }).value
      } else {
        const highlit = hljs.highlightAuto(code)
        detectedLanguage = highlit.language
        html = highlit.value
      }
    }
    return [html, detectedLanguage]
  }, [code, language])

  const sanitizedHtml = html ? DOMPurify.sanitize(html) : null
  return (
    <main className="container">
      <Header />
      <h3>Code input</h3>
      <textarea
        className="codeInput"
        value={codeDraft}
        onChange={(e) => setCodeDraft(e.target.value)}
        onBlur={() => {
          setCode(codeDraft)
          adjustTextareaRows()
        }}
        name="code"
        placeholder="Paste in your source code here..."
        aria-label="Source code"
        rows={textareaRows}
      />
      <LoadSampleCode
        onLoad={(code: string, language: string) => {
          setCodeDraft(code)
          setCode(code)
          setLanguage(language)
          adjustTextareaRows()
        }}
      />
      {sanitizedHtml !== null && (
        <article>
          <h3>Output</h3>
          <pre className="highlightedPre">
            <code
              // would use CSS modules here if it worked in HMR
              className="hljs highlightedCode"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </pre>
          <div>
            <h3>Language</h3>
            <div className="grid">
              <LanguageSelect
                onSetLanguage={setLanguage}
                language={language}
                detectedLanguage={detectedLanguage}
                languages={supportedLanguages.languages}
              />
            </div>
          </div>
          <footer>
            <CssSelector />
          </footer>
        </article>
      )}
    </main>
  )
}

export default App
