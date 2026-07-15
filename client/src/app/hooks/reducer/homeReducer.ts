import type { Track } from "@/app/interface";

interface HomeState {
  playlists: any[];
  selectedPlaylist: any | null;
  playlistTracks: Track[];
  loading: boolean;
  playlistLoading: boolean;
  isCreating: boolean;
  newPlaylistName: string;
  searchQuery: string;
  tracks: Track[];
  searchLoading: boolean;
}

export const initialState: HomeState = {
  playlists: [],
  selectedPlaylist: null,
  playlistTracks: [],
  loading: true,
  playlistLoading: false,
  isCreating: false,
  newPlaylistName: "",
  searchQuery: "",
  tracks: [],
  searchLoading: false,
};

type HomeAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PLAYLISTS"; payload: any[] }
  | { type: "ADD_PLAYLIST"; payload: any }
  | { type: "SET_NEW_PLAYLIST_NAME"; payload: string }
  | { type: "TOGGLE_CREATING" }
  | { type: "START_PLAYLIST_LOADING"; payload: any }
  | { type: "SET_PLAYLIST_TRACKS"; payload: Track[] }
  | { type: "CLEAR_SELECTED_PLAYLIST" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "START_SEARCH" }
  | { type: "SET_SEARCH_RESULTS"; payload: Track[] }
  | { type: "REMOVE_TRACK_FROM_PLAYLIST"; payload: string };

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.payload };
    case "ADD_PLAYLIST":
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
        newPlaylistName: "",
        isCreating: false,
      };
    case "SET_NEW_PLAYLIST_NAME":
      return { ...state, newPlaylistName: action.payload };
    case "TOGGLE_CREATING":
      return { ...state, isCreating: !state.isCreating };
    case "START_PLAYLIST_LOADING":
      return {
        ...state,
        playlistLoading: true,
        selectedPlaylist: action.payload,
      };
    case "SET_PLAYLIST_TRACKS":
      return {
        ...state,
        playlistTracks: action.payload,
        playlistLoading: false,
      };
    case "CLEAR_SELECTED_PLAYLIST":
      return { ...state, selectedPlaylist: null, playlistTracks: [] };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "START_SEARCH":
      return { ...state, searchLoading: true };
    case "SET_SEARCH_RESULTS":
      return { ...state, tracks: action.payload, searchLoading: false };
    case "REMOVE_TRACK_FROM_PLAYLIST":
      return {
        ...state,
        playlistTracks: state.playlistTracks.filter(
          (t) => t.jamendoId !== action.payload,
        ),
      };
    default:
      return state;
  }
}
