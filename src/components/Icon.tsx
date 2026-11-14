/**
 * Small decorative icon set. Icons are always paired with text, so they are
 * hidden from assistive technology.
 */
export type IconName =
  | 'back'
  | 'game'
  | 'story'
  | 'prasang'
  | 'external'
  | 'check'
  | 'dot'
  | 'dash'
  | 'pause'
  | 'play'
  | 'restart'
  | 'arrow-right'
  | 'arrow-left'
  | 'enter'
  | 'backspace'
  | 'lightbulb'

const PATHS: Record<IconName, string> = {
  back: 'M15 5l-7 7 7 7',
  'arrow-left': 'M15 5l-7 7 7 7',
  'arrow-right': 'M9 5l7 7-7 7',
  game: 'M6 9h12a3 3 0 013 3v2a3 3 0 01-5.2 2L14 14h-4l-1.8 2A3 3 0 013 14v-2a3 3 0 013-3zM8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01',
  story: 'M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5V19c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5zM12 6v13.5',
  prasang: 'M12 3c2 2.5 3 4.5 3 6.5a3 3 0 01-6 0C9 7.5 10 5.5 12 3zM5 15h14l-2 5H7z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  dot: 'M12 12h.01',
  dash: 'M6 12h12',
  pause: 'M9 6v12M15 6v12',
  play: 'M8 5l11 7-11 7z',
  restart: 'M4 12a8 8 0 108-8 8 8 0 00-6 2.7M4 4v5h5',
  enter: 'M20 5v7a2 2 0 01-2 2H6M10 10l-4 4 4 4',
  backspace: 'M9 5h11v14H9l-6-7zM12 9l6 6M18 9l-6 6',
  lightbulb:
    'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
}

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const isDot = name === 'dot'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isDot ? 7 : 2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
