import { useI18n } from '../i18n/context'
import { Icon } from './Icon'
import styles from './SampleTag.module.css'

/** Visible marker on every piece of sample (placeholder) content. */
export function SampleTag() {
  const { t } = useI18n()
  return (
    <span className={styles.tag} title={t('common.sampleHint')}>
      <Icon name="sample" size={16} />
      {t('common.sample')}
    </span>
  )
}
