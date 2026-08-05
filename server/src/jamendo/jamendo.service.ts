import { BadGatewayException, Injectable } from '@nestjs/common';
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
    return this.fetchTracks(url);
  }

  async getPopular(limit = 20) {
    const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=json&limit=${limit}&order=popularity_week&audioformat=mp32`;
    return this.fetchTracks(url);
  }

  async getByGenre(genre: string, limit = 20) {
    const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=json&limit=${limit}&tags=${encodeURIComponent(genre)}&audioformat=mp32`;
    return this.fetchTracks(url);
  }

  private async fetchTracks(url: string) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new BadGatewayException(`Jamendo API error: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data?.results || !Array.isArray(data.results)) {
        return [];
      }

      return this.formatTracks(data.results);
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;

      throw new BadGatewayException('Failed to fetch data from Jamendo API');
    }
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
