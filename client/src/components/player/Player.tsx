"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store";
import { Input } from "../index";
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={styles.playerBar}>
      <div className={styles.trackInfo}>
        <div className={styles.trackName}>{currentTrack.title}</div>
        <div className={styles.trackArtist}>{currentTrack.artist}</div>
      </div>

      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.playButton}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className={styles.progressContainer}>
          <span>{formatTime(currentTime)}</span>
          <Input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className={styles.progressBar}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.volumeContainer}>
        <span>🔊</span>
        <Input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeBar}
        />
      </div>
    </div>
  );
};

export default Player;
