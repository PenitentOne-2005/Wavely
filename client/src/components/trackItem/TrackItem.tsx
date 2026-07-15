"use client";

import { useState } from "react";
import type { TrackItemProps } from "./interface";
import { usePlayerStore } from "@/store";
import styles from "./TrackItem.module.css";

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
      className={`${styles.card} ${isCurrent ? styles.cardActive : ""}`.trim()}
    >
      <div>
        <div
          className={`${styles.title} ${isCurrent ? styles.titleActive : ""}`.trim()}
        >
          {track.title}
        </div>
        <div className={styles.artist}>{track.artist}</div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => setTrack(track)}
          className={`${styles.playButton} ${isCurrent && isPlaying ? styles.playButtonActive : ""}`.trim()}
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
            className={styles.removeButton}
            title="Удалить из плейлиста"
          >
            ❌
          </button>
        ) : (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={styles.addButton}
            >
              ➕
            </button>

            {menuOpen && (
              <div className={styles.menu}>
                <div className={styles.menuHeader}>Добавить в плейлист:</div>
                {playlists.length === 0 ? (
                  <div className={styles.emptyMenu}>Нет плейлистов</div>
                ) : (
                  playlists.map((pl: any) => (
                    <button
                      key={pl.id}
                      onClick={() => {
                        onAddTrackToPlaylist(pl.id, track);
                        setMenuOpen(false);
                      }}
                      className={styles.menuItem}
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
