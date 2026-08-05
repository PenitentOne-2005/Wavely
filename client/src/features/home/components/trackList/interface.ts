import type { Track } from "@/app/interface";

export interface TrackListProps {
  selectedPlaylist: any | null;
  searchQuery: string;
  searchLoading: boolean;
  playlistLoading: boolean;
  displayTracks: Track[];
  playlists: any[];
  onBackToPopular: () => void;
  onAddTrackToPlaylist: (playlistId: number, track: Track) => Promise<void>;
  onRemoveTrackFromPlaylist: (
    playlistId: number,
    jamendoId: string,
  ) => Promise<void>;
}
