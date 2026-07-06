"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import type { AuthDto } from "./interface";
import { api } from "@/api";

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
    <main style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? "Войти в аккаунт" : "Регистрация"}</h2>

        {serverError && <p style={styles.error}>{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div>
            <input
              type="email"
              placeholder="Email"
              disabled={isSubmitting}
              style={styles.input}
              {...register("email", {
                required: "Email обязателен для заполнения",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный формат email",
                },
              })}
            />
            {errors.email && (
              <span style={styles.fieldError}>{errors.email.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              disabled={isSubmitting}
              style={styles.input}
              {...register("password", {
                required: "Пароль обязателен для заполнения",
                minLength: {
                  value: 8,
                  message: "Пароль должен быть не менее 8 символов",
                },
              })}
            />
            {errors.password && (
              <span style={styles.fieldError}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
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
          style={styles.toggleButton}
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

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#181818",
    padding: "40px",
    borderRadius: "8px",
    width: "350px",
    textAlign: "center" as const,
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#282828",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#1db954",
    color: "#fff",
    fontWeight: "bold" as const,
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#b3b3b3",
    marginTop: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },
  error: { color: "#e91429", fontSize: "14px", margin: "10px 0" },
  fieldError: {
    color: "#e91429",
    fontSize: "12px",
    display: "block",
    textAlign: "left" as const,
    marginTop: "5px",
    paddingLeft: "5px",
  },
};
