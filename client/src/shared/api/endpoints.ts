export const ENDPOINTS = {
  PLAYLISTS: {
    BASE: "/playlists",
    BY_ID: (id: number | string) => `/playlists/${id}`,
    TRACKS: (playlistId: number | string) => `/playlists/${playlistId}/tracks`,
    TRACK_BY_ID: (playlistId: number | string, jamendoId: string) =>
      `/playlists/${playlistId}/tracks/${jamendoId}`,
  },
  JAMENDO: {
    POPULAR: "/jamendo/popular",
    SEARCH: (query: string) => `/jamendo/search?q=${encodeURIComponent(query)}`,
  },
};
