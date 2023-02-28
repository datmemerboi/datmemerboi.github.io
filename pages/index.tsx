import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { GITHUB_URL, LINKEDIN_URL, RESUME_URL, UNI_URL } from '../constants';
import styles from '../styles/Index.module.css';
import profileImage from '../static/images/profile-no-bg.png';

export default function Index() {
  return (
    <>
      <Head>
        <title>Shravan Dave</title>
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
              <Link href={GITHUB_URL} className={styles.link_github}>
                github
              </Link>
              <Link href={LINKEDIN_URL} className={styles.link_linkedin}>
                linkedin
              </Link>
              <Link href={RESUME_URL} className={styles.link_resume}>
                Pick up my resume
              </Link>
              <Link
                href={'mailto:appliedbyshravan@gmail.com'}
                className={styles.link_mail}
              >
                appliedbyshravan@gmail.com
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
        <div className={styles.whomai_container}>
          <div className={styles.whoami}>
            <p>
              Hello stranger! I am a student at the{' '}
              <Link href={UNI_URL} className={styles.link_linkedin}>
                University of Melbourne
              </Link>{' '}
              pursuing a Master of Software Engineering degree. Besides
              attending lectures and drowing in assignments, I work as a tutor
              at Uni for the Software Requirements Analysis course. If I am not
              knee-deep in code, I would be wathcing a movie (or) searching for
              a song I heard like a week back (or) looking for the right color
              for a palette.
            </p>
            <details>
              <summary>
                <strong>Tips to avoid awkward silence when we next meet</strong>
              </summary>
              <ul>
                <li>Show me your dog(s)! Always a great icebreaker with me.</li>
                <li>What's a JS/Web dev trick you found recently?</li>
                <li>
                  Can spend hours talking about filmmaking. What was the last
                  movie you watched? (Approach at your own risk)
                </li>
              </ul>
            </details>
          </div>
        </div>
      </main>
    </>
  );
}
