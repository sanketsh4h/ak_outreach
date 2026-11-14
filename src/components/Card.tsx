import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PlaceholderTag } from './Placeholder'
import styles from './Card.module.css'

interface CardProps {
  to: string
  title: string
  description?: string
  art?: ReactNode
  /** Leads to placeholder content: shows the Placeholder badge. */
  placeholder?: boolean
  /** lang attribute for the title and description when they fall back to another language. */
  lang?: string
  /** Put the picture above the text (always the case in Bhulkao). */
  stack?: boolean
}

/** A large tappable card used for every menu on the site. */
export function Card({ to, title, description, art, placeholder, lang, stack }: CardProps) {
  return (
    <Link to={to} className={stack ? `${styles.card} ${styles.stack}` : styles.card}>
      {art && <span className={styles.art}>{art}</span>}
      <span className={styles.text} lang={lang}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.desc}>{description}</span>}
        {placeholder && (
          <span className={styles.tag}>
            <PlaceholderTag />
          </span>
        )}
      </span>
    </Link>
  )
}

/** A list of cards. Each card sits in its own list item. */
export function CardList({ children }: { children: ReactNode }) {
  return <ul className={styles.list}>{children}</ul>
}

export function CardItem({ children }: { children: ReactNode }) {
  return <li className={styles.item}>{children}</li>
}
