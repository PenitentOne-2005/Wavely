import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} />
        <span className={styles.spinnerText}>Загрузка...</span>
      </div>
    </div>
  );
};

export default Loader;
