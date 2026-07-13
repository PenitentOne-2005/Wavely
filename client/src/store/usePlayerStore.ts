import { create } from "zustand";

export interface Track {
  id: number | string;
  jamendoId?: string;
  title: string;
  artist: string;
  audioUrl: string;
  cover: string | null;
  duration: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  audioElement: HTMLAudioElement | null;
  queue: Track[];

  setTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  nextTrack: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  initAudio: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  audioElement: null,
  queue: [],

  setQueue: (tracks) => set({ queue: tracks }),

  nextTrack: () => {
    const { queue, currentTrack, setTrack } = get();
    if (queue.length === 0 || !currentTrack) return;

    const currentIndex = queue.findIndex(
      (t) => t.audioUrl === currentTrack.audioUrl,
    );

    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      setTrack(queue[currentIndex + 1]);
    } else if (currentIndex === queue.length - 1) {
      setTrack(queue[0]);
    }
  },

  initAudio: () => {
    if (typeof window === "undefined" || get().audioElement) return;

    const audio = new Audio();
    audio.volume = get().volume;

    audio.addEventListener("timeupdate", () => {
      set({ currentTime: audio.currentTime });
    });

    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration });
    });

    audio.addEventListener("ended", () => {
      set({ isPlaying: false, currentTime: 0 });
      get().nextTrack();
    });

    set({ audioElement: audio });
  },

  setTrack: (track) => {
    const { audioElement, initAudio } = get();

    if (!audioElement) {
      initAudio();
    }

    const audio = get().audioElement;
    if (!audio) return;

    if (!track.audioUrl) {
      console.error(
        "Попытка воспроизвести трек без ссылки на аудиопоток:",
        track,
      );
      return;
    }

    audio.src = track.audioUrl;
    audio.load();
    audio
      .play()
      .then(() => set({ currentTrack: track, isPlaying: true }))
      .catch((err) => console.log("Ошибка воспроизведения:", err));
  },

  play: () => {
    const { audioElement } = get();
    if (audioElement && get().currentTrack) {
      audioElement.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) pause();
    else play();
  },

  setVolume: (volume) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = volume;
    }
    set({ volume });
  },

  setCurrentTime: (time) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.currentTime = time;
    }
    set({ currentTime: time });
  },
}));
