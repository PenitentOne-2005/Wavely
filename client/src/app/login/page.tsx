"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import type { AuthDto } from "./interface";
import { api } from "@/api";
import styles from "./Login.module.css";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthDto>({ mode: "onChange" });

  const onSubmit: SubmitHandler<AuthDto> = async (data) => {
    setServerError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await api.post(endpoint, data);
      const { token } = response.data;

      Cookies.set("token", token, { expires: 7 });

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Что-то пошло не так");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setServerError("");
    reset();
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isLogin ? "Войти в аккаунт" : "Регистрация"}
        </h2>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div>
            <input
              type="email"
              placeholder="Email"
              disabled={isSubmitting}
              className={styles.input}
              {...register("email", {
                required: "Email обязателен для заполнения",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный формат email",
                },
              })}
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              disabled={isSubmitting}
              className={styles.input}
              {...register("password", {
                required: "Пароль обязателен для заполнения",
                minLength: {
                  value: 8,
                  message: "Пароль должен быть не менее 8 символов",
                },
              })}
            />
            {errors.password && (
              <span className={styles.fieldError}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
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
