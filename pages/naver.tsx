import styles from '@/css/naver.module.css';
import Head from 'next/head';

const Page = () => {
  return (
    <>
      <Head>
        <title>naver</title>
      </Head>
      <header className={styles.header}>
        header
      </header>
      <main className={styles.main}>
        main
      </main>
      <footer className={styles.footer}>
        footer
      </footer>
    </>
  );
};

export default Page;
