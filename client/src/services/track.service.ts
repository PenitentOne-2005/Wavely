import { api, ENDPOINTS } from "@/api";

export const trackService = {
  async search(query: string) {
    const { data } = await api.get(ENDPOINTS.JAMENDO.SEARCH(query));

    return data;
  },

  async getPopular() {
    const { data } = await api.get(ENDPOINTS.JAMENDO.POPULAR);

    return data;
  },
};
