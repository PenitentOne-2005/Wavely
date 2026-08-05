import type { Playlist, Track } from "@/shared/types";
import { api, ENDPOINTS } from "@/shared/api";
import { safeFetch } from "@/shared/lib";

export const playlistService = {
  getAll(): Promise<Playlist[]> {
    return safeFetch(
      api.get(ENDPOINTS.PLAYLISTS.BASE).then((res) => res.data),
      [],
      "Ошибка при получении списка плейлистов:",
    );
  },

  getById(id: string): Promise<Playlist | null> {
    return safeFetch(
      api.get(ENDPOINTS.PLAYLISTS.BY_ID(id)).then((res) => res.data),
      null,
      `Ошибка при получении плейлиста ID=${id}:`,
    );
  },

  async create(title: string) {
    const { data } = await api.post<Playlist>(ENDPOINTS.PLAYLISTS.BASE, {
      title,
    });

    return data;
  },

  async addTrack(playlistId: number | string, track: Track) {
    const { data } = await api.post(ENDPOINTS.PLAYLISTS.TRACKS(playlistId), {
      jamendoId: track.jamendoId || String(track.id || ""),
      title: track.title,
      artist: track.artist,
      audioUrl: track.audioUrl,
      cover: track.cover || "",
      duration: track.duration || 0,
    });

    return data;
  },

  async removeTrack(playlistId: number | string, jamendoId: string) {
    const { data } = await api.delete(
      ENDPOINTS.PLAYLISTS.TRACK_BY_ID(playlistId, jamendoId),
    );

    return data;
  },
};
