import styles from '@/css/layout.module.css';

const Page = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        header
      </div>
      <div className={styles.aside}>
        aside
      </div>
      <div className={styles.main}>
        main
      </div>
      <div className={styles.footer}>
        footer
      </div>
    </div>
  );
};

export default Page;
