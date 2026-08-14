"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useReducer } from "react";
import type { Playlist, Track } from "@/shared/types";
import { homeReducer, initialState } from "./hooks";
import { usePlayerStore } from "@/shared/store";
import { playlistService, trackService } from "@/shared/services";
import { Header, PlaylistList, TrackList } from "./components";
import { Loader } from "@/shared/ui";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const router = useRouter();

  const [state, dispatch] = useReducer(homeReducer, initialState);

  const {
    playlists,
    selectedPlaylist,
    playlistTracks,
    loading,
    playlistLoading,
    isCreating,
    newPlaylistName,
    searchQuery,
    tracks,
    searchLoading,
  } = state;

  const setQueue = usePlayerStore((state) => state.setQueue);
  const displayTracks = selectedPlaylist ? playlistTracks : tracks;

  useEffect(() => {
    setQueue(displayTracks);
  }, [displayTracks, setQueue]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [playlists, popularTracks] = await Promise.all([
          playlistService.getAll(),
          trackService.getPopular(),
        ]);

        dispatch({
          type: "SET_PLAYLISTS",
          payload: playlists,
        });

        dispatch({
          type: "SET_SEARCH_RESULTS",
          payload: popularTracks,
        });
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    };

    loadData();
  }, [router]);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    dispatch({ type: "START_SEARCH" });

    try {
      const tracks = await trackService.search(searchQuery);

      dispatch({
        type: "SET_SEARCH_RESULTS",
        payload: tracks,
      });
    } catch (error) {
      console.error("Ошибка при поиске треков:", error);

      dispatch({
        type: "SET_SEARCH_RESULTS",
        payload: [],
      });
    }
  };

  const handleSelectPlaylist = async (playlist: Playlist) => {
    dispatch({
      type: "START_PLAYLIST_LOADING",
      payload: playlist,
    });

    try {
      const selectedPlaylist = await playlistService.getById(playlist.id);

      dispatch({
        type: "SET_PLAYLIST_TRACKS",
        payload: selectedPlaylist?.tracks ?? [],
      });
    } catch (error) {
      console.error("Ошибка при загрузке плейлиста:", error);

      dispatch({
        type: "SET_PLAYLIST_TRACKS",
        payload: [],
      });

      alert("Не удалось загрузить плейлист.");
    }
  };

  const handleCreatePlaylist = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!newPlaylistName.trim()) return;

    try {
      const playlist = await playlistService.create(newPlaylistName);

      dispatch({
        type: "ADD_PLAYLIST",
        payload: playlist,
      });
    } catch (error) {
      console.error("Ошибка при создании плейлиста:", error);

      alert("Не удалось создать плейлист.");
    }
  };

  const handleAddTrackToPlaylist = async (playlistId: number, track: Track) => {
    try {
      await playlistService.addTrack(playlistId, track);

      alert("Трек успешно добавлен в плейлист!");
    } catch (error) {
      console.error("Ошибка при добавлении трека:", error);

      alert("Не удалось добавить трек.");
    }
  };

  const handleRemoveTrackFromPlaylist = async (
    playlistId: number,
    jamendoId: string,
  ) => {
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
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.main}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(query) =>
          dispatch({ type: "SET_SEARCH_QUERY", payload: query })
        }
        onSearch={handleSearch}
      />

      <div className={styles.content}>
        <PlaylistList
          playlists={playlists}
          selectedPlaylist={selectedPlaylist}
          onSelectPlaylist={handleSelectPlaylist}
          isCreating={isCreating}
          setIsCreating={() => dispatch({ type: "TOGGLE_CREATING" })}
          newPlaylistName={newPlaylistName}
          setNewPlaylistName={(name) =>
            dispatch({ type: "SET_NEW_PLAYLIST_NAME", payload: name })
          }
          onCreatePlaylist={handleCreatePlaylist}
        />

        <TrackList
          selectedPlaylist={selectedPlaylist}
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          playlistLoading={playlistLoading}
          displayTracks={displayTracks}
          playlists={playlists}
          onBackToPopular={() => dispatch({ type: "CLEAR_SELECTED_PLAYLIST" })}
          onAddTrackToPlaylist={handleAddTrackToPlaylist}
          onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
        />
      </div>
    </main>
  );
};

export default HomePage;
