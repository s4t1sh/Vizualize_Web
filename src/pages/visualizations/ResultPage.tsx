import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  IoAdd,
  IoAlertCircleOutline,
  IoArrowBack,
  IoDownloadOutline,
  IoRefresh,
  IoTrashOutline,
} from 'react-icons/io5';
import { Button, ButtonLink } from '../../components/buttons/Button';
import { Modal } from '../../components/ui/Modal';
import { FormMessage } from '../../components/ui/FormMessage';
import { deleteGeneration, getGeneration, retryGenerationImage } from '../../services/generationService';
import { ApiError } from '../../services/api';
import { SPACE_LABEL } from '../../constants/spaces';
import { countImages, downloadPicture, formatDate, pictureFileName } from '../../utils/generation';
import type { Generation, GenerationImage } from '../../types';
import styles from './ResultPage.module.css';

/** How often the page asks the server for progress while pictures are being made. */
const CHECK_EVERY_MS = 3000;

const messageOf = (err: unknown) => (err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');

/** Shows the six pictures of one visualization, filling in as each one is finished. */
export function ResultPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<GenerationImage | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const waiting = generation ? countImages(generation).waiting : 0;

  const load = useCallback(async () => {
    try {
      setGeneration(await getGeneration(id));
      setLoadError(null);
    } catch (err) {
      setLoadError(messageOf(err));
    }
  }, [id]);

  // First load (ignored if the page is closed before it finishes).
  useEffect(() => {
    let active = true;
    getGeneration(id)
      .then((g) => active && setGeneration(g))
      .catch((err: unknown) => active && setLoadError(messageOf(err)));
    return () => {
      active = false;
    };
  }, [id]);

  // While pictures are still being made, check again every few seconds.
  useEffect(() => {
    if (!generation || waiting === 0) return;
    const timer = setTimeout(() => void load(), CHECK_EVERY_MS);
    return () => clearTimeout(timer);
  }, [generation, waiting, load]);

  const retry = async (image: GenerationImage) => {
    setRetryingId(image.id);
    setActionError(null);
    try {
      setGeneration(await retryGenerationImage(id, image.id));
    } catch (err) {
      setActionError(messageOf(err));
    } finally {
      setRetryingId(null);
    }
  };

  const remove = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteGeneration(id);
      navigate('/history', { replace: true });
    } catch (err) {
      setActionError(messageOf(err));
      setDeleting(false);
    }
  };

  const download = async (image: GenerationImage) => {
    if (!generation || !image.imageUrl) return;
    setDownloading(true);
    try {
      await downloadPicture(image.imageUrl, pictureFileName(generation.textureName, SPACE_LABEL[image.space], image.imageUrl));
    } catch {
      // If the direct download is blocked, open the picture so it can be saved from the browser.
      window.open(image.imageUrl, '_blank', 'noopener');
    } finally {
      setDownloading(false);
    }
  };

  if (!generation) {
    return (
      <div className={styles.state}>
        {loadError ? (
          <>
            <p className="body muted" role="alert">
              {loadError}
            </p>
            <div className={styles.stateActions}>
              <Button variant="secondary" onClick={() => void load()}>
                Try Again
              </Button>
              <ButtonLink to="/history" variant="ghost">
                Go to History
              </ButtonLink>
            </div>
          </>
        ) : (
          <span className="spinner" aria-label="Loading" />
        )}
      </div>
    );
  }

  const { done, total } = countImages(generation);

  return (
    <>
      <Link to="/history" className={styles.back}>
        <IoArrowBack size={16} aria-hidden="true" /> History
      </Link>

      <header className={`${styles.header} fade-in`}>
        <img src={generation.textureImageUrl} alt="" className={styles.sample} />
        <div className={styles.headerText}>
          <p className="overline accent">Visualization</p>
          <h1 className={`title ${styles.title}`}>{generation.textureName}</h1>
          <p className="caption muted">
            {formatDate(generation.createdAt)}
            {generation.prompt ? ` · “${generation.prompt}”` : ''}
          </p>
        </div>
      </header>

      {waiting > 0 ? (
        <div className={styles.progress} role="status" aria-live="polite">
          <p className="body">
            Creating your {total} pictures… <strong>{done} of {total} ready</strong>
          </p>
          <div className={styles.bar} aria-hidden="true">
            <span style={{ width: `${Math.max(4, (done / total) * 100)}%` }} />
          </div>
          <p className="caption muted">
            This usually takes a minute or two. You can leave this page — the pictures keep being made and will be in
            History.
          </p>
        </div>
      ) : null}

      <FormMessage message={actionError} />

      <div className={styles.grid}>
        {generation.images.map((image) => {
          const label = SPACE_LABEL[image.space];
          return (
            <figure key={image.id} className={styles.tile}>
              {image.status === 'completed' && image.imageUrl ? (
                <button
                  type="button"
                  className={styles.imageButton}
                  onClick={() => setViewing(image)}
                  aria-label={`View ${label} full size`}
                >
                  <img src={image.imageUrl} alt={`${generation.textureName} — ${label}`} className={styles.image} />
                </button>
              ) : image.status === 'failed' ? (
                <div className={`${styles.placeholder} ${styles.failed}`}>
                  <IoAlertCircleOutline size={26} aria-hidden="true" />
                  <p className="caption">{image.errorMessage ?? 'This picture could not be created.'}</p>
                  {generation.isMine ? (
                    <Button
                      variant="secondary"
                      icon={IoRefresh}
                      loading={retryingId === image.id}
                      onClick={() => void retry(image)}
                    >
                      Try Again
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className={`${styles.placeholder} ${styles.loading}`}>
                  <span className="spinner" aria-hidden="true" />
                  <p className="caption muted">{image.status === 'processing' ? 'Creating…' : 'Waiting…'}</p>
                </div>
              )}
              <figcaption className={styles.caption}>{label}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className={styles.actions}>
        <ButtonLink to="/create/surface" icon={IoAdd}>
          Create Another
        </ButtonLink>
        {/* Only the person who created it can delete it. */}
        {!generation.isMine ? null : confirmDelete ? (
          <div className={styles.confirm} role="group" aria-label="Delete this visualization?">
            <p className="caption">Delete this visualization and its pictures permanently?</p>
            <div className={styles.confirmButtons}>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button className={styles.danger} onClick={() => void remove()} loading={deleting}>
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" icon={IoTrashOutline} onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        )}
      </div>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing ? SPACE_LABEL[viewing.space] : ''}
        subtitle={generation.textureName}
        size="large"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewing(null)}>
              Close
            </Button>
            <Button icon={IoDownloadOutline} loading={downloading} onClick={() => viewing && void download(viewing)}>
              Download
            </Button>
          </>
        }
      >
        {viewing?.imageUrl ? (
          <img src={viewing.imageUrl} alt={`${generation.textureName} — ${SPACE_LABEL[viewing.space]}`} className={styles.full} />
        ) : null}
      </Modal>
    </>
  );
}
