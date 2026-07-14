export interface PlaylistListProps {
  playlists: any[];
  selectedPlaylist: any | null;
  onSelectPlaylist: (playlist: any) => void;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  newPlaylistName: string;
  setNewPlaylistName: (name: string) => void;
  onCreatePlaylist: (e: React.FormEvent<HTMLFormElement>) => void;
}
