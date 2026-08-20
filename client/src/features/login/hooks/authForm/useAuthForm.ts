import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { AuthDto } from "../../interface";
import { api } from "@/shared/api";

const useAuthForm = (reset: () => void) => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");

  const onSubmit: SubmitHandler<AuthDto> = useCallback(
    async (data) => {
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
    },
    [isLogin, router],
  );

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setServerError("");
    reset();
  }, [reset]);

  return { isLogin, serverError, onSubmit, toggleMode };
};

export default useAuthForm;
