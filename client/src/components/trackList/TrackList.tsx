"use client";

import { TrackItem } from "../index";
import type { TrackListProps } from "./interface";

const TrackList = ({
  selectedPlaylist,
  searchQuery,
  searchLoading,
  playlistLoading,
  displayTracks,
  playlists,
  onBackToPopular,
  onAddTrackToPlaylist,
  onRemoveTrackFromPlaylist,
}: TrackListProps) => {
  return (
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

        {selectedPlaylist && (
          <button
            onClick={onBackToPopular}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {displayTracks.map((track, index) => {
            const trackKey = track.id || track.jamendoId || `track-${index}`;

            return (
              <TrackItem
                key={trackKey}
                track={track}
                trackKey={String(trackKey)}
                selectedPlaylist={selectedPlaylist}
                playlists={playlists}
                onAddTrackToPlaylist={onAddTrackToPlaylist}
                onRemoveTrackFromPlaylist={onRemoveTrackFromPlaylist}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackList;
