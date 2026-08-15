"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TrackItemProps } from "./interface";
import { usePlayerStore } from "@/shared/store";
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
  const isLoading = usePlayerStore((state) => state.isLoading);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const isCurrent = currentTrack?.audioUrl === track.audioUrl;
  const trackKey = track.jamendoId || String(track.id);
  const titleId = `track-title-${trackKey}`;

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        addButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !addButtonRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleToggleMenu = () => {
    if (!menuOpen && addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 180,
      });
    }
    setMenuOpen(!menuOpen);
  };

  const playLabel =
    isCurrent && isLoading
      ? "Загрузка..."
      : isCurrent && isPlaying
        ? "Играет"
        : isCurrent
          ? "Продолжить"
          : "Включить";

  return (
    <section
      className={`${styles.card} ${isCurrent ? styles.cardActive : ""}`.trim()}
      aria-labelledby={titleId}
    >
      <div>
        <h4
          id={titleId}
          className={`${styles.title} ${isCurrent ? styles.titleActive : ""}`.trim()}
        >
          {track.title}
        </h4>
        <div className={styles.artist}>{track.artist}</div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => setTrack(track)}
          className={styles.playButton}
          aria-label={`${playLabel}: ${track.title}, ${track.artist}`}
          aria-pressed={isCurrent && isPlaying}
        >
          {playLabel}
        </button>

        {selectedPlaylist ? (
          <button
            type="button"
            onClick={() =>
              onRemoveTrackFromPlaylist(
                selectedPlaylist.id,
                track.jamendoId || String(track.id),
              )
            }
            className={styles.removeButton}
            title="Удалить из плейлиста"
            aria-label={`Удалить «${track.title}» из плейлиста «${selectedPlaylist.title}»`}
          >
            ❌
          </button>
        ) : (
          <>
            <button
              ref={addButtonRef}
              type="button"
              onClick={handleToggleMenu}
              className={styles.addButton}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label={`Добавить «${track.title}» в плейлист`}
            >
              ➕
            </button>

            {menuOpen &&
              menuPosition &&
              createPortal(
                <div
                  className={styles.menu}
                  role="menu"
                  ref={menuRef}
                  style={{
                    position: "fixed",
                    top: menuPosition.top,
                    left: menuPosition.left,
                  }}
                >
                  <div className={styles.menuHeader}>Добавить в плейлист:</div>
                  {playlists.length === 0 ? (
                    <div className={styles.emptyMenu}>Нет плейлистов</div>
                  ) : (
                    playlists.map((pl: any) => (
                      <button
                        key={pl.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onAddTrackToPlaylist(pl.id, track);
                          setMenuOpen(false);
                          addButtonRef.current?.focus();
                        }}
                        className={styles.menuItem}
                      >
                        <span aria-hidden="true" className={styles.menuIcon}>
                          📁
                        </span>
                        <span>{pl.title}</span>
                      </button>
                    ))
                  )}
                </div>,
                document.body,
              )}
          </>
        )}
      </div>
    </section>
  );
};

export default TrackItem;
