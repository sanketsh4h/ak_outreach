import type { MessageKey } from '../i18n/messages'

/**
 * The single place where section slugs, story segment names and the games in
 * each section are defined. Renaming a section's URL (for example "yuvako")
 * is a one-line change to its `slug` here.
 */

export type SectionId = 'bhulkao' | 'yuvako'
export type GameId = 'doodle' | 'pills' | 'words'
export type PartId = 'activity' | 'story' | 'prasang'

export interface GameConfig {
  id: GameId
  /** URL segment under /<section>/activity/ */
  slug: string
  titleKey: MessageKey
  descKey: MessageKey
}

export interface SectionConfig {
  id: SectionId
  /** URL segment, e.g. /bhulkao */
  slug: string
  /** URL segment for stories: "story" for Bhulkao, "scenario" for Yuvako. */
  storySegment: string
  nameKey: MessageKey
  leadKey: MessageKey
  introDescKey: MessageKey
  /** Locale keys for the story part, which is called a story or a scenario. */
  storyTitleKey: MessageKey
  storyDescKey: MessageKey
  storyListTitleKey: MessageKey
  activityDescKey: MessageKey
  /** Heading for the lesson box under a prasang. */
  prasangLessonKey: MessageKey
  games: GameId[]
}

export const GAMES: Record<GameId, GameConfig> = {
  doodle: {
    id: 'doodle',
    slug: 'doodle',
    titleKey: 'game.doodle.title',
    descKey: 'game.doodle.desc',
  },
  pills: { id: 'pills', slug: 'pills', titleKey: 'game.pills.title', descKey: 'game.pills.desc' },
  words: { id: 'words', slug: 'words', titleKey: 'game.words.title', descKey: 'game.words.desc' },
}

export const SECTIONS: Record<SectionId, SectionConfig> = {
  bhulkao: {
    id: 'bhulkao',
    slug: 'bhulkao',
    storySegment: 'story',
    nameKey: 'section.bhulkao.name',
    leadKey: 'section.bhulkao.lead',
    introDescKey: 'intro.bhulkao.desc',
    storyTitleKey: 'part.story.title',
    storyDescKey: 'part.story.desc',
    storyListTitleKey: 'list.story.title',
    activityDescKey: 'part.activity.desc.bhulkao',
    prasangLessonKey: 'prasang.lesson.bhulkao',
    games: ['doodle'],
  },
  yuvako: {
    id: 'yuvako',
    slug: 'yuvako',
    storySegment: 'scenario',
    nameKey: 'section.yuvako.name',
    leadKey: 'section.yuvako.lead',
    introDescKey: 'intro.yuvako.desc',
    storyTitleKey: 'part.scenario.title',
    storyDescKey: 'part.scenario.desc',
    storyListTitleKey: 'list.scenario.title',
    activityDescKey: 'part.activity.desc.yuvako',
    prasangLessonKey: 'prasang.lesson.yuvako',
    games: ['pills', 'words'],
  },
}

export const SECTION_LIST: SectionConfig[] = [SECTIONS.bhulkao, SECTIONS.yuvako]

export function isSectionId(value: unknown): value is SectionId {
  return value === 'bhulkao' || value === 'yuvako'
}

/** Find which section a URL path (without the base path) belongs to. */
export function sectionFromPath(pathname: string): SectionId | null {
  const first = pathname.split('/').filter(Boolean)[0]
  return SECTION_LIST.find((s) => s.slug === first)?.id ?? null
}

/** Build in-app paths (React Router adds the base path). */
export const paths = {
  home: () => '/',
  section: (id: SectionId) => `/${SECTIONS[id].slug}`,
  activity: (id: SectionId) => `/${SECTIONS[id].slug}/activity`,
  game: (id: SectionId, game: GameId) => `/${SECTIONS[id].slug}/activity/${GAMES[game].slug}`,
  storyList: (id: SectionId) => `/${SECTIONS[id].slug}/${SECTIONS[id].storySegment}`,
  story: (id: SectionId, storyId: string) =>
    `/${SECTIONS[id].slug}/${SECTIONS[id].storySegment}/${encodeURIComponent(storyId)}`,
  prasangList: (id: SectionId) => `/${SECTIONS[id].slug}/prasang`,
  prasang: (id: SectionId, prasangId: string) =>
    `/${SECTIONS[id].slug}/prasang/${encodeURIComponent(prasangId)}`,
}
