import type { ReactNode } from "react"
import { useSessionStorage } from "usehooks-ts"
import styleCssNames from "./_highlight-styles.json"
import { useCss } from "./CssContext"

const _darkRegex = /\b(dark|night|black|cybertopia)\b/i
const darkOnes = new Set([
  "codepen-embed.css",
  "gml.css",
  "srcery.css",
  "sunburst.css",
  "rose-pine.css",
  "nord.css",
  "rose-pine-moon.css",
  "shades-of-purple.css",
  "obsidian.css",
  "vs2015.css",
  "agate.css",
  "cybertopia-saturated.css",
  "lioshi.css",
  "rainbow.css",
  "hybrid.css",
  "felipec.css",
  "hybrid.css",
  "cybertopia-cherry.css",
  "devibeans.css",
  "an-old-hope.css",
  "androidstudio.css",
  "arta.css",
  "xt256.css",
  "monokai-sublime.css",
])
type FilterValue = "either" | "dark" | "light"

export function CssSelector() {
  const { css, temporaryCss, setCss, setTemporaryCss } = useCss()

  const [filter, setFilter] = useSessionStorage<FilterValue>(
    "css-filter",
    "either",
  )

  let soonTimer: number
  const setTemporaryCssSoon = (name: string) => {
    setTemporaryCss(name)
    if (soonTimer) {
      window.clearTimeout(soonTimer)
    }
    soonTimer = window.setTimeout(() => {
      setTemporaryCss(name)
    }, 200)
  }

  const filtered = styleCssNames.styles.filter((styleName) => {
    if (filter === "dark") {
      return _darkRegex.test(styleName) || darkOnes.has(styleName)
    } else if (filter === "light") {
      return !(_darkRegex.test(styleName) || darkOnes.has(styleName))
    }
    return true
  })
  return (
    <div>
      <h3>Theme</h3>
      <div style={{ marginBottom: 20 }}>
        {filtered.map((styleName) => {
          // would use CSS modules here if it worked in HMR
          let className = ""
          if (!(css === styleName || temporaryCss === styleName)) {
            className += "outline"
          }
          className += " secondary"
          className += " themeButton"

          return (
            <button
              type="button"
              className={className}
              key={styleName}
              onFocus={() => {
                setTemporaryCss(styleName)
              }}
              onMouseOver={() => {
                setTemporaryCssSoon(styleName)
              }}
              onMouseOut={() => {
                setTemporaryCssSoon("")
              }}
              onBlur={() => {
                setTemporaryCss("")
              }}
              onClick={() => {
                setCss(styleName)
              }}
            >
              {styleName}
            </button>
          )
        })}
      </div>

      <div role="group">
        <FilterButton filter={filter} setFilter={setFilter} value="either">
          Either
        </FilterButton>
        <FilterButton filter={filter} setFilter={setFilter} value="dark">
          Dark only
        </FilterButton>
        <FilterButton filter={filter} setFilter={setFilter} value="light">
          Light only
        </FilterButton>
      </div>
    </div>
  )
}

function FilterButton({
  filter,
  setFilter,
  value,
  children,
}: {
  filter: FilterValue
  setFilter: (filter: FilterValue) => void
  value: FilterValue
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`${filter === value ? "" : "outline"} secondary filterButton`}
      aria-current={filter === value && "true"}
      onClick={() => setFilter(value)}
    >
      {children}
    </button>
  )
}
