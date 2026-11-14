/**
 * Decorative illustrations for menu cards. Original drawings made for this
 * project. They carry no meaning of their own (the card text does), so they
 * are hidden from assistive technology.
 */
const common = {
  viewBox: '0 0 120 80',
  'aria-hidden': true,
  focusable: false,
} as const

export function KiteArt() {
  return (
    <svg {...common}>
      <circle cx="96" cy="18" r="10" fill="#f4c552" />
      <path d="M50 8 L72 34 L50 62 L28 34 Z" fill="#e4572e" />
      <path d="M50 8 L50 62 M28 34 L72 34" stroke="#fff6e5" strokeWidth="3" />
      <path d="M50 62 C46 68 56 70 52 76" stroke="#5b3a9b" strokeWidth="3" fill="none" />
      <path d="M47 68 l-6 3 6 3z M55 72 l6 3-6 3z" fill="#2f8f5b" />
    </svg>
  )
}

export function LampArt() {
  return (
    <svg {...common}>
      <path d="M60 10 C68 22 68 30 60 36 C52 30 52 22 60 10 Z" fill="#f4c552" />
      <path d="M60 18 C63 24 63 28 60 31 C57 28 57 24 60 18 Z" fill="#e4572e" />
      <path d="M32 44 H88 C86 60 74 68 60 68 C46 68 34 60 32 44 Z" fill="#b5651d" />
      <path d="M40 72 H80" stroke="#1d4f78" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function GameArt() {
  return (
    <svg {...common}>
      <rect x="22" y="26" width="76" height="36" rx="18" fill="currentColor" />
      <path d="M40 36 v16 M32 44 h16" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="78" cy="38" r="5" fill="#f4c552" />
      <circle cx="88" cy="48" r="5" fill="#e4572e" />
      <path d="M96 10 l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#f4c552" />
    </svg>
  )
}

export function StoryArt() {
  return (
    <svg {...common}>
      <path d="M60 20 C48 12 32 12 20 16 V66 C32 62 48 62 60 70 Z" fill="currentColor" />
      <path d="M60 20 C72 12 88 12 100 16 V66 C88 62 72 62 60 70 Z" fill="#f4c552" />
      <path
        d="M30 30 h20 M30 40 h20 M30 50 h14"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M70 30 h20 M70 40 h20 M70 50 h14"
        stroke="#1c2230"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PrasangArt() {
  return (
    <svg {...common}>
      <path d="M60 12 C70 26 70 36 60 44 C50 36 50 26 60 12 Z" fill="#f4c552" />
      <path d="M60 44 C46 30 30 34 26 44 C36 54 50 54 60 44 Z" fill="#e88aa8" />
      <path d="M60 44 C74 30 90 34 94 44 C84 54 70 54 60 44 Z" fill="#e88aa8" />
      <path
        d="M24 60 C40 54 80 54 96 60"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M34 70 C48 66 72 66 86 70"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
