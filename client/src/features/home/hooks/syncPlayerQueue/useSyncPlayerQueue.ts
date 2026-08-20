import { useEffect } from "react";
import type { Track } from "@/shared/types";
import { usePlayerStore } from "@/shared/store";

const useSyncPlayerQueue = (displayTracks: Track[]) => {
  const setQueue = usePlayerStore((state) => state.setQueue);

  useEffect(() => {
    setQueue(displayTracks);
  }, [displayTracks, setQueue]);
};

export default useSyncPlayerQueue;
