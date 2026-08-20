import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { HomeAction } from "../reducer";
import { playlistService, trackService } from "@/shared/services";

const useHomeInit = (dispatch: React.Dispatch<HomeAction>) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        const [playlists, popularTracks] = await Promise.all([
          playlistService.getAll(),
          trackService.getPopular(),
        ]);

        if (cancelled) return;

        dispatch({ type: "SET_PLAYLISTS", payload: playlists });
        dispatch({ type: "SET_SEARCH_RESULTS", payload: popularTracks });
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        if (!cancelled) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [router, dispatch]);
};

export default useHomeInit;
