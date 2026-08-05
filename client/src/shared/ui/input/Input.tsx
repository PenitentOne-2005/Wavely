import type { InputProps } from "./interface";
import styles from "./Input.module.css";

const Input = ({ error, ...props }: InputProps) => {
  return (
    <>
      <input className={`${styles.input}`} {...props} />
      {error && <span className={styles.fieldError}>{error}</span>}
    </>
  );
};

export default Input;
