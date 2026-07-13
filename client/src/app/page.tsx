"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { Track } from "./interface";
import { api } from "@/api";
import { usePlayerStore } from "@/store";
import styles from "./page.module.css";

const Home = () => {
  const router = useRouter();

  const setTrack = usePlayerStore((state) => state.setTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [activeTrackMenu, setActiveTrackMenu] = useState<string | null>(null);

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
      setActiveTrackMenu(null);
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1>Мой Музыкальный Сервис</h1>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Что хотите послушать?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "1px solid #333",
              backgroundColor: "#1f1f1f",
              color: "#fff",
              width: "250px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#1db954",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Найти
          </button>
        </form>
      </header>

      {/* Основной контент (Две колонки: Плейлисты и Треки) */}
      <div style={{ display: "flex", gap: "40px" }}>
        {/* Левая колонка: Плейлисты */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#121212",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0 }}>Ваши плейлисты</h3>
            <button
              onClick={() => setIsCreating(!isCreating)}
              style={{
                backgroundColor: isCreating ? "#e91429" : "#1db954",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isCreating ? "×" : "+"}
            </button>
          </div>

          {/* Форма создания нового плейлиста */}
          {isCreating && (
            <form
              onSubmit={handleCreatePlaylist}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Название плейлиста"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #333",
                  backgroundColor: "#1f1f1f",
                  color: "#fff",
                }}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Создать
              </button>
            </form>
          )}

          {playlists.length === 0 ? (
            <p style={{ color: "#b3b3b3" }}>У вас пока нет плейлистов</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {playlists.map((pl: any) => {
                const isSelected = selectedPlaylist?.id === pl.id;
                return (
                  <li
                    key={pl.id}
                    onClick={() => handleSelectPlaylist(pl)}
                    style={{
                      padding: "10px 12px",
                      color: "#fff",
                      backgroundColor: isSelected ? "#1db954" : "#181818",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = "#282828";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = "#181818";
                    }}
                  >
                    🎵 {pl.title}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Правая колонка: Результаты поиска треков */}
        <div style={{ flex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0 }}>
              {selectedPlaylist
                ? `Плейлист: ${selectedPlaylist.title}`
                : searchQuery
                  ? "Результаты поиска"
                  : "Популярные треки"}
            </h3>

            {/* Кнопка возврата к общему списку, если выбран плейлист */}
            {selectedPlaylist && (
              <button
                onClick={() => {
                  setSelectedPlaylist(null);
                  setPlaylistTracks([]);
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#1db954",
                  border: "1px solid #1db954",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ← К популярным
              </button>
            )}
          </div>

          {searchLoading || playlistLoading ? (
            <p>Загрузка треков...</p>
          ) : displayTracks.length === 0 ? (
            <p style={{ color: "#b3b3b3" }}>
              {selectedPlaylist
                ? "В этом плейлисте пока нет треков"
                : "Введите запрос в поиске сверху"}
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {displayTracks.map((track, index) => {
                const isCurrent = currentTrack?.audioUrl === track.audioUrl;
                const trackKey =
                  track.id || track.jamendoId || `track-${index}`;

                return (
                  <div
                    key={trackKey}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: "#181818",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: isCurrent ? "#1db954" : "#282828",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: isCurrent ? "#1db954" : "#fff",
                        }}
                      >
                        {track.title}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#b3b3b3",
                          marginTop: "4px",
                        }}
                      >
                        {track.artist}
                      </div>
                    </div>

                    {/* Блок кнопок */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => setTrack(track)}
                        style={{
                          backgroundColor:
                            isCurrent && isPlaying ? "#1db954" : "#282828",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {isCurrent && isPlaying
                          ? "🔊 Играет"
                          : isCurrent
                            ? "⏸ На паузе"
                            : "▶ Включить"}
                      </button>

                      {selectedPlaylist ? (
                        <button
                          onClick={() =>
                            handleRemoveTrackFromPlaylist(
                              selectedPlaylist.id,
                              track.jamendoId || String(track.id),
                            )
                          }
                          style={{
                            backgroundColor: "transparent",
                            color: "#e91429",
                            border: "1px solid #e91429",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e91429";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#e91429";
                          }}
                          title="Удалить из плейлиста"
                        >
                          ❌
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setActiveTrackMenu(
                                activeTrackMenu === String(trackKey)
                                  ? null
                                  : String(trackKey),
                              )
                            }
                            style={{
                              backgroundColor: "#282828",
                              color: "#fff",
                              border: "none",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ➕
                          </button>

                          {activeTrackMenu === String(trackKey) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "45px",
                                right: 0,
                                backgroundColor: "#282828",
                                border: "1px solid #3e3e3e",
                                borderRadius: "6px",
                                boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
                                zIndex: 10,
                                minWidth: "180px",
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              <div
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "12px",
                                  color: "#b3b3b3",
                                  borderBottom: "1px solid #3e3e3e",
                                  fontWeight: "bold",
                                }}
                              >
                                Добавить в плейлист:
                              </div>
                              {playlists.length === 0 ? (
                                <div
                                  style={{
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    color: "#b3b3b3",
                                  }}
                                >
                                  Нет плейлистов
                                </div>
                              ) : (
                                playlists.map((pl: any) => (
                                  <button
                                    key={pl.id}
                                    onClick={() =>
                                      handleAddTrackToPlaylist(pl.id, track)
                                    }
                                    style={{
                                      width: "100%",
                                      textAlign: "left",
                                      backgroundColor: "transparent",
                                      color: "#fff",
                                      border: "none",
                                      padding: "10px 12px",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        "#3e3e3e")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        "transparent")
                                    }
                                  >
                                    📁 {pl.title}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
