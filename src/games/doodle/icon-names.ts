/**
 * The built-in icon set for doodle items. In content/doodle-items.json, each
 * item's "icon" names one of these. An unknown name falls back to a generic
 * icon (and `npm run validate` warns about it).
 */
export const DOODLE_ICON_NAMES = [
  'book',
  'moon',
  'family',
  'ball',
  'hands',
  'heart',
  'pencil',
  'tree',
  'sun',
  'phone',
  'bell',
  'loop',
  'clock',
  'screen',
  'controller',
] as const

export type DoodleIconName = (typeof DOODLE_ICON_NAMES)[number]
