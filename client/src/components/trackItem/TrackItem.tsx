"use client";

import { useState } from "react";
import type { TrackItemProps } from "./interface";
import { usePlayerStore } from "@/store";

const TrackItem = ({
  track,
  selectedPlaylist,
  playlists,
  onAddTrackToPlaylist,
  onRemoveTrackFromPlaylist,
}: TrackItemProps) => {
  const setTrack = usePlayerStore((state) => state.setTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrent = currentTrack?.audioUrl === track.audioUrl;

  return (
    <div
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

      {/* Блок кнопок управления */}
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
            backgroundColor: isCurrent && isPlaying ? "#1db954" : "#282828",
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
              onRemoveTrackFromPlaylist(
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
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#e91429";
            }}
            title="Удалить из плейлиста"
          >
            ❌
          </button>
        ) : (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
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

            {menuOpen && (
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
                      onClick={() => {
                        onAddTrackToPlaylist(pl.id, track);
                        setMenuOpen(false); // Закрываем меню после добавления
                      }}
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
                        (e.currentTarget.style.backgroundColor = "#3e3e3e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
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
};

export default TrackItem;
