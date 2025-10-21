import { StorefrontSection } from '@/features/storefront';
import styles from './page.module.css';

export default function StorePage() {
  return (
    <div className={styles.storePage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Anti-Fascist Book Store</h1>
        <p className={styles.pageDescription}>
          Browse our curated collection of antifascist literature, educational resources, and books from independent publishers.
        </p>
        <StorefrontSection />
      </div>
    </div>
  );
}
