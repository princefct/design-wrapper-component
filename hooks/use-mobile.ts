import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * True when the device can actually hover (mouse/trackpad). Tailwind gates its
 * `hover:` utilities behind `@media (hover: hover)`, so any affordance that is
 * only revealed on hover simply does not exist on touch screens — those need a
 * persistent control instead.
 */
export function useHasHover() {
  const [hasHover, setHasHover] = React.useState(true)

  React.useEffect(() => {
    const mql = window.matchMedia("(hover: hover)")
    const onChange = () => setHasHover(mql.matches)
    mql.addEventListener("change", onChange)
    setHasHover(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return hasHover
}
