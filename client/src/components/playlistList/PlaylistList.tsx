"use client";

import type { PlaylistListProps } from "./interface";

const PlaylistList = ({
  playlists,
  selectedPlaylist,
  onSelectPlaylist,
  isCreating,
  setIsCreating,
  newPlaylistName,
  setNewPlaylistName,
  onCreatePlaylist,
}: PlaylistListProps) => {
  return (
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
          onSubmit={onCreatePlaylist}
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
                onClick={() => onSelectPlaylist(pl)}
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
  );
};

export default PlaylistList;
