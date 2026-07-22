import type { InputProps } from "./interface";
import styles from "./Input.module.css";

const Input = ({ error, ...props }: InputProps) => {
  return (
    <div>
      <input className={styles.input} {...props} />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
};

export default Input;
