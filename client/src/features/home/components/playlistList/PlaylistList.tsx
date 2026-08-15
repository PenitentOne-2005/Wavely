"use client";

import type { PlaylistListProps } from "./interface";
import { Input } from "@/shared/ui";
import styles from "./Playlist.module.css";

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
    <section className={styles.container} aria-labelledby="playlists-heading">
      <div className={styles.header}>
        <h3 id="playlists-heading" className={styles.title}>
          Ваши плейлисты
        </h3>
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          aria-expanded={isCreating}
          className={styles.toggleButton}
          aria-label={
            isCreating ? "Закрыть форму создания плейлиста" : "Создать плейлист"
          }
        >
          {isCreating ? "×" : "+"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={onCreatePlaylist} className={styles.createForm}>
          <Input
            type="text"
            label="Название плейлиста"
            placeholder="Название плейлиста"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            style={{ width: "100%" }}
            autoFocus
          />
          <button type="submit" className={styles.createButton}>
            Создать
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className={styles.emptyState}>У вас пока нет плейлистов</p>
      ) : (
        <ul className={styles.list}>
          {playlists.map((pl: any, index: number) => {
            const isSelected = selectedPlaylist?.id === pl.id;

            return (
              <li key={pl.id} className={styles.listItem}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectPlaylist(pl)}
                  className={styles.item}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span aria-hidden="true" className={styles.icon}>
                    🎵
                  </span>
                  <span>{pl.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default PlaylistList;
