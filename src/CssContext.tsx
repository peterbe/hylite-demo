import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useSessionStorage } from "usehooks-ts"
import styleCssNames from "./_highlight-styles.json"

if (!styleCssNames.styles[0]) throw new Error("No default style found")
const DEFAULT_STYLE = styleCssNames.styles[0]

function setCssLink(name: string) {
  const linkId = "highlightjs-style"
  let link = document.getElementById(linkId) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement("link")
    link.id = linkId
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }
  const url = `/styles/${name}`
  if (link.href === url) return
  link.href = url
}

type CssContext = {
  css: string
  temporaryCss: string
  setCss: (css: string) => void
  setTemporaryCss: (css: string) => void
}

export const CssContext = createContext<CssContext>({
  css: DEFAULT_STYLE,
  temporaryCss: "",
  setCss: () => {},
  setTemporaryCss: () => {},
})

export const CssProvider = ({ children }: { children: ReactNode }) => {
  const [css, setCss] = useSessionStorage("theme", DEFAULT_STYLE)
  const [temporaryCss, setTemporaryCss] = useState("")
  useEffect(() => {
    const either = temporaryCss || css
    if (either) {
      setCssLink(either)
    }
  }, [temporaryCss, css])

  return (
    <CssContext.Provider value={{ css, temporaryCss, setCss, setTemporaryCss }}>
      {children}
    </CssContext.Provider>
  )
}

export function useCss() {
  return useContext(CssContext)
}
