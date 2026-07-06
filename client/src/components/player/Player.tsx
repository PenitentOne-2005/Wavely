"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store";

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
    <div style={styles.playerBar}>
      {/* Информация о треке */}
      <div style={styles.trackInfo}>
        <div style={styles.trackName}>{currentTrack.name}</div>
        <div style={styles.trackArtist}>{currentTrack.artist_name}</div>
      </div>

      {/* Управление воспроизведением */}
      <div style={styles.controls}>
        <button onClick={togglePlay} style={styles.playButton}>
          {isPlaying ? "⏸ Пауза" : "▶ Играть"}
        </button>

        {/* Прогресс-бар трека */}
        <div style={styles.progressContainer}>
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            style={styles.progressBar}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div style={styles.volumeContainer}>
        <span>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={styles.volumeBar}
        />
      </div>
    </div>
  );
};

export default Player;

const styles = {
  playerBar: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: "90px",
    backgroundColor: "#181818",
    borderTop: "1px solid #282828",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "#fff",
    fontFamily: "sans-serif",
    zIndex: 1000,
  },
  trackInfo: {
    display: "flex",
    flexDirection: "column" as const,
    width: "30%",
  },
  trackName: { fontSize: "14px", fontWeight: "bold" },
  trackArtist: { fontSize: "12px", color: "#b3b3b3", marginTop: "4px" },
  controls: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "40%",
    gap: "8px",
  },
  playButton: {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 24px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    fontSize: "12px",
    color: "#b3b3b3",
  },
  progressBar: { flex: 1, accentColor: "#1db954", cursor: "pointer" },
  volumeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "30%",
    justifyContent: "flex-end",
  },
  volumeBar: { accentColor: "#1db954", cursor: "pointer", width: "100px" },
};
