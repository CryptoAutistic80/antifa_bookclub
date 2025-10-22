import styles from './page.module.css';

export default function StorePage() {
  return (
    <div className={styles.storePage}>
      <div className={styles.container}>
        <div className={styles.comingSoonBanner}>
          <h1 className={styles.comingSoonTitle}>Coming Soon</h1>
          <p className={styles.comingSoonText}>
            Our Anti-Fascist Book Store is currently under development.
            <br />
            Check back soon for our curated collection of literature and educational resources.
          </p>
        </div>
      </div>
    </div>
  );
}
