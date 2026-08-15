import { useId } from "react";
import type { InputProps } from "./interface";
import styles from "./Input.module.css";

const Input = ({ error, label, id, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.srOnly}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={styles.input}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span
          id={errorId}
          className={styles.fieldError}
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
