import { useCallback } from "react";
import type { HomeState, HomeAction } from "../reducer";
import type { Playlist, Track } from "@/shared/types";
import { playlistService, trackService } from "@/shared/services";

const useHomeActions = (
  state: HomeState,
  dispatch: React.Dispatch<HomeAction>,
) => {
  const { searchQuery, newPlaylistName } = state;

  const handleSearch = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      dispatch({ type: "START_SEARCH" });

      try {
        const tracks = await trackService.search(searchQuery);
        dispatch({ type: "SET_SEARCH_RESULTS", payload: tracks });
      } catch (error) {
        console.error("Ошибка при поиске треков:", error);
        dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      }
    },
    [searchQuery, dispatch],
  );

  const handleSelectPlaylist = useCallback(
    async (playlist: Playlist) => {
      dispatch({ type: "START_PLAYLIST_LOADING", payload: playlist });
      try {
        const selectedPlaylist = await playlistService.getById(playlist.id);
        dispatch({
          type: "SET_PLAYLIST_TRACKS",
          payload: selectedPlaylist?.tracks ?? [],
        });
      } catch (error) {
        console.error("Ошибка при загрузке плейлиста:", error);
        dispatch({ type: "SET_PLAYLIST_TRACKS", payload: [] });
        alert("Не удалось загрузить плейлист.");
      }
    },
    [dispatch],
  );

  const handleCreatePlaylist = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newPlaylistName.trim()) return;

      try {
        const playlist = await playlistService.create(newPlaylistName);
        dispatch({ type: "ADD_PLAYLIST", payload: playlist });
      } catch (error) {
        console.error("Ошибка при создании плейлиста:", error);
        alert("Не удалось создать плейлист.");
      }
    },
    [newPlaylistName, dispatch],
  );

  const handleAddTrackToPlaylist = useCallback(
    async (playlistId: number, track: Track) => {
      try {
        await playlistService.addTrack(playlistId, track);
        alert("Трек успешно добавлен в плейлист!");
      } catch (error) {
        console.error("Ошибка при добавлении трека:", error);
        alert("Не удалось добавить трек.");
      }
    },
    [],
  );

  const handleRemoveTrackFromPlaylist = useCallback(
    async (playlistId: number, jamendoId: string) => {
      try {
        await playlistService.removeTrack(playlistId, jamendoId);
        dispatch({
          type: "REMOVE_TRACK_FROM_PLAYLIST",
          payload: jamendoId,
        });
        alert("Трек удалён из плейлиста.");
      } catch (error) {
        console.error("Ошибка при удалении трека:", error);
        alert("Не удалось удалить трек.");
      }
    },
    [dispatch],
  );

  const setSearchQuery = useCallback(
    (query: string) => dispatch({ type: "SET_SEARCH_QUERY", payload: query }),
    [dispatch],
  );

  const setIsCreating = useCallback(
    () => dispatch({ type: "TOGGLE_CREATING" }),
    [dispatch],
  );

  const setNewPlaylistName = useCallback(
    (name: string) =>
      dispatch({ type: "SET_NEW_PLAYLIST_NAME", payload: name }),
    [dispatch],
  );

  const onBackToPopular = useCallback(
    () => dispatch({ type: "CLEAR_SELECTED_PLAYLIST" }),
    [dispatch],
  );

  return {
    handleSearch,
    handleSelectPlaylist,
    handleCreatePlaylist,
    handleAddTrackToPlaylist,
    handleRemoveTrackFromPlaylist,
    setSearchQuery,
    setIsCreating,
    setNewPlaylistName,
    onBackToPopular,
  };
};

export default useHomeActions;
