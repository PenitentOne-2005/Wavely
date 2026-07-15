import { api } from "@/api";
import { ENDPOINTS } from "@/constants";
import type { Track } from "@/app/interface";

export const apiService = {
  getPlaylists: () => api.get(ENDPOINTS.PLAYLISTS.BASE),

  getPlaylistById: (id: number | string) =>
    api.get(ENDPOINTS.PLAYLISTS.BY_ID(id)),

  createPlaylist: (title: string) =>
    api.post(ENDPOINTS.PLAYLISTS.BASE, { title }),

  addTrackToPlaylist: (playlistId: number | string, track: Track) => {
    return api.post(ENDPOINTS.PLAYLISTS.TRACKS(playlistId), {
      jamendoId: track.jamendoId || String(track.id || ""),
      title: track.title,
      artist: track.artist,
      audioUrl: track.audioUrl,
      cover: track.cover || "",
      duration: track.duration || 0,
    });
  },

  removeTrackFromPlaylist: (playlistId: number | string, jamendoId: string) => {
    return api.delete(ENDPOINTS.PLAYLISTS.TRACK_BY_ID(playlistId, jamendoId));
  },

  getPopularTracks: () => api.get(ENDPOINTS.JAMENDO.POPULAR),

  searchTracks: (query: string) => api.get(ENDPOINTS.JAMENDO.SEARCH(query)),
};
