import Image from 'next/image';
import Link from 'next/link';

import { CARD } from '../constants';
import styles from '../styles/Card.module.css';

interface CardProps {
  imageSource?: string;
  title?: string;
  body: string;
  url: string;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  title,
  body,
  url
}: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__image__container}>
        {imageSource != null ? (
          <Image
            src={imageSource}
            width={CARD.IMAGE.DESKTOP_WIDTH}
            height={CARD.IMAGE.DESKTOP_HEIGHT}
            alt={CARD.IMAGE.FALLBACK}
          />
        ) : (
          <Image
            src={CARD.IMAGE.FALLBACK}
            width={CARD.IMAGE.DESKTOP_WIDTH}
            height={CARD.IMAGE.DESKTOP_HEIGHT}
            alt={CARD.IMAGE.FALLBACK}
          />
        )}
      </div>
      <div>
        {title != null ? (
          <div>
            <h3 className={styles.card__title}>{title}</h3>
          </div>
        ) : null}
        <div className={styles.card__body}>
          <p>{body}</p>
        </div>
        <div className={styles.card__link__container}>
          <Link href={url} target="_blank">
            View this repo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
