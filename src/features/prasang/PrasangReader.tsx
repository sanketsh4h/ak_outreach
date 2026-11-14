import Markdown, { type Components } from 'react-markdown'
import { useI18n } from '../../i18n/context'
import { NATIVE_NAMES } from '../../i18n/languages'
import { ContentImage } from '../../components/ContentImage'
import { ExternalLink } from '../../components/ExternalLink'
import { LessonBox } from '../../components/LessonBox'
import { PlaceholderNotice } from '../../components/Placeholder'
import { SECTIONS, type SectionId } from '../../config/sections'
import type { PrasangDoc, PrasangEntry } from '../../content'
import styles from './Prasang.module.css'

function markdownComponents(placeholder: boolean): Components {
  return {
    // Keep a single h1 per page: headings in the body start at h2.
    h1: ({ children }) => <h2>{children}</h2>,
    img: ({ src, alt }) =>
      typeof src === 'string' ? (
        <ContentImage src={src} alt={alt ?? ''} placeholder={placeholder} />
      ) : null,
    a: ({ href, children }) =>
      href && /^https?:\/\//i.test(href) ? (
        <ExternalLink href={href}>{children}</ExternalLink>
      ) : (
        <a href={href}>{children}</a>
      ),
  }
}

/** Title, cover, body with pictures, then the moral in the lesson box. */
export function PrasangReader({ entry, section }: { entry: PrasangEntry; section: SectionId }) {
  const { t, lang } = useI18n()
  const doc = (entry.docs[lang] ?? entry.docs.en) as PrasangDoc
  const isFallback = doc.lang !== lang
  const cover = doc.front.images[0]

  return (
    <>
      {entry.placeholder && <PlaceholderNotice />}
      {isFallback && (
        <p className={styles.fallback} role="note">
          {t('prasang.fallback', { language: NATIVE_NAMES[lang] })}
        </p>
      )}
      <article className={styles.article} lang={doc.lang} data-audience={section}>
        <h1>{doc.front.title}</h1>
        {cover && (
          <ContentImage
            src={cover.src}
            alt={cover.alt ?? ''}
            placeholder={entry.placeholder}
            eager
          />
        )}
        <div className={styles.body}>
          <Markdown skipHtml components={markdownComponents(entry.placeholder)}>
            {doc.body}
          </Markdown>
        </div>
        <LessonBox heading={t(SECTIONS[section].prasangLessonKey)}>
          <p>{doc.front.moral}</p>
        </LessonBox>
      </article>
    </>
  )
}
