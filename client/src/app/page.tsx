"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import type { Track } from "./interface";
import { apiService } from "@/services";
import { usePlayerStore } from "@/store";
import { homeReducer, initialState } from "./hooks";
import { Header, PlaylistList, TrackList } from "@/components";
import { Loader } from "@/ui";
import styles from "./page.module.css";

const Home = () => {
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

    apiService
      .getPlaylists()
      .then((res) => {
        dispatch({ type: "SET_PLAYLISTS", payload: res.data });
        dispatch({ type: "SET_LOADING", payload: false });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          Cookies.remove("token");
          router.push("/login");
        }
      });

    apiService
      .getPopularTracks()
      .then((res) => {
        dispatch({ type: "SET_SEARCH_RESULTS", payload: res.data });
      })
      .catch((err) => {
        console.error("Ошибка загрузки популярных треков:", err);
      });
  }, [router]);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    dispatch({ type: "START_SEARCH" });

    try {
      const response = await apiService.searchTracks(searchQuery);

      dispatch({ type: "SET_SEARCH_RESULTS", payload: response.data });
    } catch (err) {
      console.error("Ошибка при поиске треков:", err);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
    }
  };

  const handleSelectPlaylist = async (playlist: any) => {
    dispatch({ type: "START_PLAYLIST_LOADING", payload: playlist });

    try {
      const response = await apiService.getPlaylistById(playlist.id);

      dispatch({
        type: "SET_PLAYLIST_TRACKS",
        payload: response.data.tracks || [],
      });
    } catch (err) {
      console.error("Ошибка при загрузке треков плейлиста:", err);
      alert("Не удалось загрузить треки плейлиста.");
      dispatch({ type: "SET_PLAYLIST_TRACKS", payload: [] });
    }
  };

  const handleCreatePlaylist = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const response = await apiService.createPlaylist(newPlaylistName);

      dispatch({ type: "ADD_PLAYLIST", payload: response.data });
    } catch (err: any) {
      console.error(
        "Ошибка при создании плейлиста:",
        err.response?.data || err,
      );
      const serverMessage =
        err.response?.data?.message || "Не удалось создать плейлист.";
      alert(
        Array.isArray(serverMessage) ? serverMessage.join(", ") : serverMessage,
      );
    }
  };

  const handleAddTrackToPlaylist = async (playlistId: number, track: Track) => {
    try {
      await apiService.addTrackToPlaylist(playlistId, track);

      alert("Трек успешно добавлен в плейлист!");
    } catch (err: any) {
      console.error("Ошибка при добавлении трека:", err.response?.data || err);
      alert("Не удалось добавить трек в плейлист.");
    }
  };

  const handleRemoveTrackFromPlaylist = async (
    playlistId: number,
    jamendoId: string,
  ) => {
    try {
      await apiService.removeTrackFromPlaylist(playlistId, jamendoId);

      dispatch({ type: "REMOVE_TRACK_FROM_PLAYLIST", payload: jamendoId });
      alert("Трек удален из плейлиста");
    } catch (err) {
      console.error("Ошибка при удалении трека:", err);
      alert("Не удалось удалить трек из плейлиста.");
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
}

export default Home;
