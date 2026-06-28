import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JamendoService {
  private readonly clientId: string;
  private readonly baseUrl = 'https://api.jamendo.com/v3.0';

  constructor(private readonly config: ConfigService) {
    this.clientId = config.get<string>('JAMENDO_CLIENT_ID')!;
  }

  async search(query: string, limit = 20) {
    const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`;
    const res = await fetch(url);
    const data = await res.json();

    return this.formatTracks(data.results);
  }

  async getPopular(limit = 20) {
    const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=json&limit=${limit}&order=popularity_total&audioformat=mp32`;
    const res = await fetch(url);
    const data = await res.json();

    return this.formatTracks(data.results);
  }

  async getByGenre(genre: string, limit = 20) {
    const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=json&limit=${limit}&tags=${genre}&audioformat=mp32`;
    const res = await fetch(url);
    const data = await res.json();

    return this.formatTracks(data.results);
  }

  private formatTracks(tracks: any[]) {
    return tracks.map((track) => ({
      jamendoId: track.id,
      title: track.name,
      artist: track.artist_name,
      cover: track.album_image,
      duration: track.duration,
      audioUrl: track.audio,
    }));
  }
}
