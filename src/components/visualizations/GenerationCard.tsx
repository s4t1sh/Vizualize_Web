import { Link } from 'react-router';
import type { Generation } from '../../types';
import { CATEGORY_LABEL } from '../../constants/textures';
import { formatPrice } from '../../utils/format';
import { countImages, describeGeneration, formatDate } from '../../utils/generation';
import styles from './GenerationCard.module.css';

/**
 * A visualization in a list (History and Home): a room picture on top; underneath, the
 * sample's details on the left and the sample photo on the right.
 */
export function GenerationCard({ generation }: { generation: Generation }) {
  const preview = generation.images.find((img) => img.status === 'completed' && img.imageUrl)?.imageUrl;
  const { waiting } = countImages(generation);
  const price =
    generation.texturePriceAmount !== null && generation.texturePriceUnit
      ? formatPrice(generation.texturePriceAmount, generation.texturePriceUnit)
      : null;
  const type = generation.textureCategory ? CATEGORY_LABEL[generation.textureCategory] : null;
  const typeAndPrice = [type, price].filter(Boolean).join(' · ');

  return (
    <Link to={`/visualizations/${generation.id}`} className={styles.item}>
      <span className={styles.card}>
        <span className={styles.imageWrap}>
          <img src={preview ?? generation.textureImageUrl} alt="" loading="lazy" className={styles.image} />
          {waiting > 0 ? <span className={styles.badge}>Creating…</span> : null}
        </span>
        <span className={styles.bottom}>
          <span className={styles.info}>
            <span className={styles.name}>{generation.textureName}</span>
            {typeAndPrice ? <span className={`caption ${styles.price}`}>{typeAndPrice}</span> : null}
            <span className="caption muted">
              {formatDate(generation.createdAt)} · {describeGeneration(generation)}
            </span>
          </span>
          <img
            src={generation.textureImageUrl}
            alt={`${generation.textureName} sample`}
            loading="lazy"
            className={styles.sample}
          />
        </span>
      </span>
    </Link>
  );
}
