"use client";

import type { PlaylistListProps } from "./interface";
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ваши плейлисты</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={`${styles.toggleButton} ${isCreating ? styles.toggleButtonActive : ""}`.trim()}
        >
          {isCreating ? "×" : "+"}
        </button>
      </div>

      {/* Форма создания нового плейлиста */}
      {isCreating && (
        <form onSubmit={onCreatePlaylist} className={styles.createForm}>
          <input
            type="text"
            placeholder="Название плейлиста"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className={styles.input}
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
          {playlists.map((pl: any) => {
            const isSelected = selectedPlaylist?.id === pl.id;
            return (
              <li
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className={`${styles.item} ${isSelected ? styles.selectedItem : ""}`.trim()}
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
