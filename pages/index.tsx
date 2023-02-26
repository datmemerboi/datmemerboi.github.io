import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/Index.module.css';
import profileImage from '../static/images/profile-no-bg.png';
import { RESUME_URL } from '../constants';

export default function Home() {
  return (
    <>
      <Head>
        <title>Shravan Dave | datmemerboi</title>
        <meta name="description" content="Hello! Hello! Hello!" />
        <link rel="icon" href="https://github.com/datmemerboi.png" />
      </Head>

      <main className={styles.container}>
        <div className={styles.profile}>
          <div className={styles.profile_name_container}>
            <div>
              <h1 className={styles.profile_name}>SHRAVAN DAVE</h1>
              <h3 className={styles.subtitle}>
                Developer | Designer | Student
              </h3>
            </div>
            <div className={styles.external_links}>
              <Link
                href={'https://github.com/datmemerboi'}
                className={styles.link_github}
              >
                github
              </Link>
              <Link
                href={'https://in.linkedin.com/in/datmemerboi'}
                className={styles.link_linkedin}
              >
                linkedin
              </Link>
              <Link
                href={'mailto:appliedbyshravan@gmail.com'}
                className={styles.link_mail}
              >
                appliedbyshravan@gmail.com
              </Link>
              <Link href={RESUME_URL} className={styles.link_resume}>
                Pick up my resume
              </Link>
            </div>
          </div>
          <div className={styles.profile_image_container}>
            <Image
              src={profileImage}
              alt="Profile image"
              width={400}
              height={400}
              className={styles.profile_image_circle}
            ></Image>
          </div>
        </div>
      </main>
    </>
  );
}
