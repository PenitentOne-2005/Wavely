export interface Track {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  duration: number;
  cover: string | null;
  jamendoId?: string;
  createdAt?: string;
}
