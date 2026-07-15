import type { Track } from "@/app/interface";

export interface TrackItemProps {
  track: Track;
  selectedPlaylist: any | null;
  playlists: any[];
  onAddTrackToPlaylist: (playlistId: number, track: Track) => Promise<void>;
  onRemoveTrackFromPlaylist: (
    playlistId: number,
    jamendoId: string,
  ) => Promise<void>;
}
