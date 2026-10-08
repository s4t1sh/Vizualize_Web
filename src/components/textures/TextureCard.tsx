import type { ReactNode } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import type { Texture } from '../../types';
import { CATEGORY_LABEL } from '../../constants/textures';
import { formatPrice } from '../../utils/format';
import styles from './TextureCard.module.css';

interface TextureCardProps {
  texture: Texture;
  selected?: boolean;
  onSelect?: () => void;
  /** Extra content under the details (Edit / Delete buttons). */
  footer?: ReactNode;
}

export function TextureCard({ texture, selected = false, onSelect, footer }: TextureCardProps) {
  const details = [texture.size, texture.finish].filter(Boolean).join(' · ');
  const price = formatPrice(texture.priceAmount, texture.priceUnit);

  const body = (
    <>
      <div className={styles.imageWrap}>
        <img src={texture.thumbnailUrl} alt={texture.name} loading="lazy" className={styles.image} />
        {selected ? (
          <span className={styles.check} aria-hidden="true">
            <IoCheckmark size={18} />
          </span>
        ) : null}
      </div>
      <div className={styles.info}>
        <span className={`overline muted ${styles.category}`}>{CATEGORY_LABEL[texture.category]}</span>
        <span className={styles.name}>{texture.name}</span>
        {details ? <span className="caption muted">{details}</span> : null}
        {price ? <span className={`caption ${styles.price}`}>{price}</span> : null}
      </div>
    </>
  );

  return (
    <div className={`${styles.card} ${selected ? styles.selected : ''}`}>
      {onSelect ? (
        <button
          type="button"
          className={styles.selectButton}
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`${texture.name}${selected ? ' (selected)' : ''}`}
        >
          {body}
        </button>
      ) : (
        body
      )}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
