"use client";

import { memo } from "react";
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
  const headingText = selectedPlaylist
    ? `Плейлист: ${selectedPlaylist.title}`
    : searchQuery
      ? "Результаты поиска"
      : "Популярные треки";

  return (
    <section className={styles.container} aria-labelledby="tracklist-heading">
      <div className={styles.header}>
        <h3 id="tracklist-heading" className={styles.title}>
          {headingText}
        </h3>

        {selectedPlaylist && (
          <button
            type="button"
            onClick={onBackToPopular}
            className={styles.backButton}
          >
            ← К популярным
          </button>
        )}
      </div>

      {searchLoading || playlistLoading ? (
        <p className={styles.loading} role="status" aria-live="polite">
          Загрузка треков...
        </p>
      ) : displayTracks.length === 0 ? (
        <p className={styles.emptyState}>
          {selectedPlaylist
            ? "В этом плейлисте пока нет треков"
            : searchQuery
              ? "По вашему запросу ничего не найдено"
              : "Популярные треки временно недоступны. Попробуйте воспользоваться поиском."}
        </p>
      ) : (
        <ul className={styles.list}>
          {displayTracks.map((track, index) => {
            const trackKey = track.id || track.jamendoId || `track-${index}`;

            return (
              <li
                key={trackKey}
                className={styles.trackItemWrapper}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <TrackItem
                  track={track}
                  selectedPlaylist={selectedPlaylist}
                  playlists={playlists}
                  onAddTrackToPlaylist={onAddTrackToPlaylist}
                  onRemoveTrackFromPlaylist={onRemoveTrackFromPlaylist}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default memo(TrackList);
