import styles from '@/css/naver.module.css';
import Head from 'next/head';

const Page = () => {
  return (
    <>
      <Head>
        <title>naver</title>
      </Head>
      <div className={styles.layout}>
        naver
      </div>
    </>
  );
};

export default Page;
