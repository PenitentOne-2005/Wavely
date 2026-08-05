import { api, ENDPOINTS } from "@/shared/api";
import { safeFetch } from "@/shared/lib";

export const trackService = {
  async search(query: string) {
    return safeFetch(
      api.get(ENDPOINTS.JAMENDO.SEARCH(query)).then((res) => res.data),
      [],
      `Ошибка при поиске треков ("${query}"):`,
    );
  },

  async getPopular() {
    return safeFetch(
      api.get(ENDPOINTS.JAMENDO.POPULAR).then((res) => res.data),
      [],
      "Ошибка при получении популярных треков:",
    );
  },
};
