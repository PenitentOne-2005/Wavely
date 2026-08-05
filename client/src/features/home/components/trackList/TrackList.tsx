"use client";

import type { TrackListProps } from "./interface";
import { TrackItem } from "./components";
import styles from "./TrackList.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {selectedPlaylist
            ? `Плейлист: ${selectedPlaylist.title}`
            : searchQuery
              ? "Результаты поиска"
              : "Популярные треки"}
        </h3>

        {selectedPlaylist && (
          <button onClick={onBackToPopular} className={styles.backButton}>
            ← К популярным
          </button>
        )}
      </div>

      {searchLoading || playlistLoading ? (
        <p className={styles.loading}>Загрузка треков...</p>
      ) : displayTracks.length === 0 ? (
        <p className={styles.emptyState}>
          {selectedPlaylist
            ? "В этом плейлисте пока нет треков"
            : searchQuery
              ? "По вашему запросу ничего не найдено"
              : "Популярные треки временно недоступны. Попробуйте воспользоваться поиском."}
        </p>
      ) : (
        <div className={styles.list}>
          {displayTracks.map((track, index) => {
            const trackKey = track.id || track.jamendoId || `track-${index}`;

            return (
              <TrackItem
                key={trackKey}
                track={track}
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
