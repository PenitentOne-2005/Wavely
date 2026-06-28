import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthRequest } from 'src/auth/jwt';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, UpdatePlaylistDto, AddTrackDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreatePlaylistDto) {
    return this.playlistsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.playlistsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.playlistsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.playlistsService.remove(req.user.id, id);
  }

  @Post(':id/tracks')
  addTrack(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddTrackDto,
  ) {
    return this.playlistsService.addTrack(req.user.id, id, dto);
  }

  @Delete(':id/tracks/:jamendoId')
  removeTrack(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('jamendoId') jamendoId: string,
  ) {
    return this.playlistsService.removeTrack(req.user.id, id, jamendoId);
  }
}
