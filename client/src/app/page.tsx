"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { Track } from "./interface";
import { api } from "@/api";
import { usePlayerStore } from "@/store";
import { Header, PlaylistList, TrackList } from "@/components";
import styles from "./page.module.css";

const Home = () => {
  const router = useRouter();

  // Состояния плейлистов
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Состояния треков и поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

    api
      .get("/playlists")
      .then((res) => {
        setPlaylists(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          Cookies.remove("token");
          router.push("/login");
        }
      });

    api
      .get("/jamendo/popular")
      .then((res) => {
        setTracks(res.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки популярных треков:", err);
      });
  }, [router]);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await api.get(`/jamendo/search?q=${searchQuery}`);
      setTracks(response.data);
    } catch (err) {
      console.error("Ошибка при поиске треков:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectPlaylist = async (playlist: any) => {
    setPlaylistLoading(true);
    setSelectedPlaylist(playlist);
    try {
      const response = await api.get(`/playlists/${playlist.id}`);
      setPlaylistTracks(response.data.tracks || []);
    } catch (err) {
      console.error("Ошибка при загрузке треков плейлиста:", err);
      alert("Не удалось загрузить треки плейлиста.");
    } finally {
      setPlaylistLoading(false);
    }
  };

  const handleCreatePlaylist = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const response = await api.post("/playlists", { title: newPlaylistName });
      setPlaylists((prev) => [...prev, response.data]);
      setNewPlaylistName("");
      setIsCreating(false);
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
      await api.post(`/playlists/${playlistId}/tracks`, {
        jamendoId: track.jamendoId || String(track.id || ""),
        title: track.title,
        artist: track.artist,
        audioUrl: track.audioUrl,
        cover: track.cover || "",
        duration: track.duration || 0,
      });
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
      await api.delete(`/playlists/${playlistId}/tracks/${jamendoId}`);
      setPlaylistTracks((prev) =>
        prev.filter((t) => t.jamendoId !== jamendoId),
      );
      alert("Трек удален из плейлиста");
    } catch (err) {
      console.error("Ошибка при удалении трека:", err);
      alert("Не удалось удалить трек из плейлиста.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          color: "#fff",
          backgroundColor: "#121212",
          height: "100vh",
          padding: "20px",
        }}
      >
        Загрузка приложения...
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {/* 1. Компонент шапки */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Основной контент */}
      <div style={{ display: "flex", gap: "40px" }}>
        {/* 2. Компонент списка плейлистов */}
        <PlaylistList
          playlists={playlists}
          selectedPlaylist={selectedPlaylist}
          onSelectPlaylist={handleSelectPlaylist}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          newPlaylistName={newPlaylistName}
          setNewPlaylistName={setNewPlaylistName}
          onCreatePlaylist={handleCreatePlaylist}
        />

        {/* 3. Компонент списка треков */}
        <TrackList
          selectedPlaylist={selectedPlaylist}
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          playlistLoading={playlistLoading}
          displayTracks={displayTracks}
          playlists={playlists}
          onBackToPopular={() => {
            setSelectedPlaylist(null);
            setPlaylistTracks([]);
          }}
          onAddTrackToPlaylist={handleAddTrackToPlaylist}
          onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
        />
      </div>
    </main>
  );
};

export default Home;
