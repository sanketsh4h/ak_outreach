/** Move focus to an element (normally a heading) without scrolling, making it focusable first. */
export function focusElement(target: HTMLElement | null | undefined): void {
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

/** Move focus to the new page's main heading after a client-side navigation. */
export function focusMainHeading(container: HTMLElement | null): void {
  if (!container) return
  focusElement(container.querySelector<HTMLElement>('h1') ?? container)
}
