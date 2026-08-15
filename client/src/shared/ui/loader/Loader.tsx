import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} aria-hidden="true" />
        <span className={styles.spinnerText}>Загрузка...</span>
      </div>
    </div>
  );
};

export default Loader;
