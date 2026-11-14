import type { SectionId } from '../config/sections'
import type { LocalizedText } from '../i18n/localized'

/** Short description of a story or prasang, for list pages. */
export interface ItemSummary {
  id: string
  title: LocalizedText
  placeholder: boolean
}

// Filled in at milestone 2 (content loaders).
export function storiesFor(section: SectionId): ItemSummary[] {
  void section
  return []
}

export function prasangsFor(section: SectionId): ItemSummary[] {
  void section
  return []
}
