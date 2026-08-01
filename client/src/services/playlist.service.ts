import { api, ENDPOINTS } from "@/api";
import { Track } from "@/app/interface";

export const playlistService = {
  async getAll() {
    const { data } = await api.get(ENDPOINTS.PLAYLISTS.BASE);

    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(ENDPOINTS.PLAYLISTS.BY_ID(id));

    return data;
  },

  async create(title: string) {
    const { data } = await api.post(ENDPOINTS.PLAYLISTS.BASE, { title });

    return data;
  },

  async addTrack(playlistId: number | string, track: Track) {
    return api.post(ENDPOINTS.PLAYLISTS.TRACKS(playlistId), {
      jamendoId: track.jamendoId || String(track.id || ""),
      title: track.title,
      artist: track.artist,
      audioUrl: track.audioUrl,
      cover: track.cover || "",
      duration: track.duration || 0,
    });
  },

  async removeTrack(playlistId: number | string, jamendoId: string) {
    return api.delete(ENDPOINTS.PLAYLISTS.TRACK_BY_ID(playlistId, jamendoId));
  },
};
