import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { NAV_PAGE_ORDER } from '../constants';
import styles from '../styles/Home.module.css';

export default function NavBar() {
  let { asPath } = useRouter();
  console.log(asPath);
  // const [currentPage, setCurrentPage] = useState<number>(0);

  let navLinks = NAV_PAGE_ORDER.map((name: string, i: number) => {
    let currentPageStyle = asPath.includes(name)
      ? `${styles.nav__link__text} ${styles.nav__link__textCurrent}`
      : styles.nav__link__text;

    if (i === 0) {
      return (
        <div className={styles.nav__link}>
          <Link href="#about" className={currentPageStyle}>
            {name}
          </Link>
        </div>
      );
    }
    return (
      <div className={styles.nav__link}>
        <Link href={`/${name.toLocaleLowerCase()}`} className={currentPageStyle}>
          {name}
        </Link>
      </div>
    );
  });

  return (
    <nav className={styles.nav}>
      <div>Hello!</div>
      <div className={styles.nav__links__container}>{navLinks}</div>
    </nav>
  );
}
