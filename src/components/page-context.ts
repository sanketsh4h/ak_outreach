import { createContext, useContext, useEffect } from 'react'

export interface BackLink {
  to: string
  /** Name of the parent page, already translated. */
  label: string
}

export interface PageInfo {
  /** Page title, already translated. Used for document.title. */
  title: string
  back?: BackLink
}

export const PageContext = createContext<(info: PageInfo) => void>(() => {})

/** Each page declares its title and parent page; the layout shows them. */
export function usePage(title: string, back?: BackLink): void {
  const setPage = useContext(PageContext)
  const backTo = back?.to
  const backLabel = back?.label
  useEffect(() => {
    setPage({
      title,
      back:
        backTo !== undefined && backLabel !== undefined
          ? { to: backTo, label: backLabel }
          : undefined,
    })
  }, [setPage, title, backTo, backLabel])
}
