"use client";

import { useForm } from "react-hook-form";
import type { AuthDto } from "./interface";
import { useAuthForm } from "./hooks";
import { Input } from "@/shared/ui";
import styles from "./LoginPage.module.css";

const AuthPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthDto>({ mode: "onChange" });

  const { isLogin, serverError, onSubmit, toggleMode } = useAuthForm(reset);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h2 id="auth-title" className={styles.title}>
          {isLogin ? "Войти в аккаунт" : "Регистрация"}
        </h2>

        {serverError && (
          <p className={styles.error} role="alert" aria-live="assertive">
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          aria-labelledby="auth-title"
          noValidate
        >
          <Input
            type="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email", {
              required: "Email обязателен для заполнения",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некорректный формат email",
              },
            })}
          />

          <Input
            type="password"
            label="Пароль"
            placeholder="Пароль"
            autoComplete={isLogin ? "current-password" : "new-password"}
            disabled={isSubmitting}
            error={errors.password?.message}
            {...register("password", {
              required: "Пароль обязателен для заполнения",
              minLength: {
                value: 8,
                message: "Пароль должен быть не менее 8 символов",
              },
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={styles.button}
          >
            {isSubmitting
              ? "Загрузка..."
              : isLogin
                ? "Войти"
                : "Создать аккаунт"}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          disabled={isSubmitting}
          className={styles.toggleButton}
        >
          {isLogin
            ? "Еще нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </main>
  );
};

export default AuthPage;
