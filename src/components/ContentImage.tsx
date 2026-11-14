import { imageUrl } from '../content'
import { PlaceholderPictureLabel } from './Placeholder'
import styles from './ContentImage.module.css'

interface ContentImageProps {
  /** File name in content/images/. */
  src: string
  alt: string
  /** Shows a visible "Placeholder" label inside the picture. */
  placeholder?: boolean
  /** Load immediately (for the first picture on a page). */
  eager?: boolean
}

/**
 * A picture named in a content file. Uses a span wrapper so it is valid inside
 * a markdown paragraph as well as on its own.
 */
export function ContentImage({ src, alt, placeholder, eager }: ContentImageProps) {
  const url = imageUrl(src)
  if (!url) return null
  return (
    <span className={styles.frame}>
      <img
        src={url}
        alt={alt}
        width={400}
        height={300}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      {placeholder && <PlaceholderPictureLabel />}
    </span>
  )
}
