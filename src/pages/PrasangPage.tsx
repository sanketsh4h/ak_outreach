import { useParams } from 'react-router'
import { useI18n } from '../i18n/context'
import { usePage } from '../components/page-context'
import { ContentError } from '../components/ContentError'
import { SECTIONS, paths, type SectionId } from '../config/sections'
import { getPrasang, prasangsFor } from '../content'
import { PrasangReader } from '../features/prasang/PrasangReader'
import NotFound from './NotFound'

export default function PrasangPage({ section }: { section: SectionId }) {
  const { id } = useParams()
  const entry = id ? getPrasang(section, id) : undefined
  if (!entry) return <NotFound section={section} item />
  return <PrasangEntryView section={section} entryId={entry.id} />
}

function PrasangEntryView({ section, entryId }: { section: SectionId; entryId: string }) {
  const { t, lang } = useI18n()
  const entry = getPrasang(section, entryId)!
  const config = SECTIONS[section]
  const doc = entry.docs[lang] ?? entry.docs.en
  const back =
    prasangsFor(section).length > 1
      ? { to: paths.prasangList(section), label: t('list.prasang.title') }
      : { to: paths.section(section), label: t(config.nameKey) }
  usePage(doc?.front.title ?? t('prasang.error.title'), back)

  if (entry.errors.length > 0 || !entry.docs.en) {
    return <ContentError titleKey="prasang.error.title" problems={entry.errors} />
  }
  return <PrasangReader entry={entry} section={section} />
}
