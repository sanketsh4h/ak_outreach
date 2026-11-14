import { useParams } from 'react-router'
import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { ContentError } from '../components/ContentError'
import { SECTIONS, paths, type SectionId } from '../config/sections'
import { getStory, storiesFor } from '../content'
import { StoryPlayer } from '../features/story/StoryPlayer'
import NotFound from './NotFound'

export default function StoryPage({ section }: { section: SectionId }) {
  const { id } = useParams()
  const entry = id ? getStory(section, id) : undefined
  if (!entry) return <NotFound section={section} item />
  return <StoryEntryView section={section} entryId={entry.id} />
}

function StoryEntryView({ section, entryId }: { section: SectionId; entryId: string }) {
  const { t, l } = useI18n()
  const entry = getStory(section, entryId)!
  const config = SECTIONS[section]
  // With one story the list page redirects here, so "back" goes to the section.
  const back =
    storiesFor(section).length > 1
      ? { to: paths.storyList(section), label: t(config.storyListTitleKey) }
      : { to: paths.section(section), label: t(config.nameKey) }
  usePage(entry.title ? l(entry.title) : t('story.error.title'), back)

  if (!entry.story) return <ContentError titleKey="story.error.title" problems={entry.errors} />
  return <StoryPlayer key={entry.id} story={entry.story} section={section} />
}
