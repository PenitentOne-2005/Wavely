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

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleSearch = async (e: React.FormEvent) => {
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
    <div
      className={styles.main}
      style={{ padding: "40px", color: "#fff", fontFamily: "sans-serif" }}
    >
      {/* Шапка и Поиск */}
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
        <div style={{ flex: 1 }}>
          <h3>Ваши плейлисты</h3>
          {playlists.length === 0 ? (
            <p style={{ color: "#b3b3b3" }}>У вас пока нет плейлистов</p>
          ) : (
            <ul>
              {playlists.map((pl: any) => (
                <li key={pl.id} style={{ padding: "8px 0", color: "#b3b3b3" }}>
                  {pl.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Правая колонка: Результаты поиска треков */}
        <div style={{ flex: 2 }}>
          <h3>{searchQuery ? "Результаты поиска" : "Популярные треки"}</h3>
          {searchLoading ? (
            <p>Ищем треки...</p>
          ) : tracks.length === 0 ? (
            <p style={{ color: "#b3b3b3" }}>Введите запрос в поиске сверху</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {tracks.map((track, index) => {
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
                      {/* Исправлено: Теперь берем свойства строго из отмаппленного интерфейса Track */}
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

                    <button
                      onClick={() => setTrack(track)}
                      style={{
                        backgroundColor: "#282828",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {isCurrent ? "🔊 Играет" : "▶ Включить"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
