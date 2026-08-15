"use client";

import { useEffect } from "react";
import { formatTime } from "./utils";
import { usePlayerStore } from "@/shared/store";
import { Input } from "@/shared/ui";
import styles from "./Player.module.css";

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    currentTime,
    duration,
    setCurrentTime,
    initAudio,
  } = usePlayerStore();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  if (!currentTrack) return null;

  return (
    <div className={styles.playerBar} role="region" aria-label="Аудиоплеер">
      <div className={styles.trackInfo} aria-live="polite" aria-atomic="true">
        <h2 className={styles.trackName}>{currentTrack.title}</h2>
        <p className={styles.trackArtist}>{currentTrack.artist}</p>
      </div>

      <div className={styles.controls}>
        <button
          onClick={togglePlay}
          className={styles.playButton}
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className={styles.progressContainer}>
          <span aria-hidden="true">{formatTime(currentTime)}</span>
          <Input
            type="range"
            label="Перемотка трека"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className={styles.progressBar}
            aria-valuetext={`${formatTime(currentTime)} из ${formatTime(duration)}`}
          />
          <span aria-hidden="true">{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.volumeContainer}>
        <span aria-hidden="true">🔊</span>
        <Input
          type="range"
          label="Громкость"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeBar}
          aria-valuetext={`${Math.round(volume * 100)}%`}
        />
      </div>
    </div>
  );
};

export default Player;
