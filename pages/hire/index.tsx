import Head from 'next/head';
import { Fragment } from 'react';

import { RESUME_URL } from '../../constants';
import styles from '../../styles/Hire.module.css';

export default function Hire() {
  return (
    <Fragment>
      <Head>
        <title>Hire Me! - Shravan Dave</title>
      </Head>

      <div className={styles.hire__container}>
        <div className={styles.hire__row}>
          <p className={styles.hire__message}>
            Yep, this is bang-on, center!
            <br />
            Now please{' '}
            <a href={RESUME_URL} target="_blank">
              hire me
            </a>
            .
          </p>
        </div>
      </div>
    </Fragment>
  );
}
