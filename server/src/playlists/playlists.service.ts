import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Track } from '../tracks';
import { CreatePlaylistDto, UpdatePlaylistDto, AddTrackDto } from './dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepo: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
  ) {}

  async create(userId: number, dto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistRepo.create({ ...dto, userId });
    return this.playlistRepo.save(playlist);
  }

  async findAll(userId: number): Promise<Playlist[]> {
    return this.playlistRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number): Promise<Playlist> {
    return this.findOneOrFail(id, userId);
  }

  async update(userId: number, id: number, dto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.findOneOrFail(id, userId);

    Object.assign(playlist, dto);

    return this.playlistRepo.save(playlist);
  }

  async addTrack(userId: number, playlistId: number, dto: AddTrackDto): Promise<Playlist> {
    const playlist = await this.findOneOrFail(playlistId, userId);

    let track = await this.trackRepo.findOne({ where: { jamendoId: dto.jamendoId } });
    if (!track) {
      track = this.trackRepo.create(dto);
      await this.trackRepo.save(track);
    }

    const alreadyAdded = playlist.tracks.some((t) => t.jamendoId === dto.jamendoId);
    if (!alreadyAdded) {
      playlist.tracks.push(track);
      await this.playlistRepo.save(playlist);
    }

    return playlist;
  }

  async remove(userId: number, id: number): Promise<void> {
    const playlist = await this.findOneOrFail(id, userId);

    await this.playlistRepo.remove(playlist);
  }

  async removeTrack(userId: number, playlistId: number, jamendoId: string): Promise<Playlist> {
    const playlist = await this.findOneOrFail(playlistId, userId);
    playlist.tracks = playlist.tracks.filter((t) => t.jamendoId !== jamendoId);

    return this.playlistRepo.save(playlist);
  }

  private async findOneOrFail(id: number, userId: number): Promise<Playlist> {
    const playlist = await this.playlistRepo.findOne({ where: { id } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) throw new ForbiddenException();

    return playlist;
  }
}
