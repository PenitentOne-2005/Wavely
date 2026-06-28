import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt';
import { JamendoService } from './jamendo.service';

@UseGuards(JwtAuthGuard)
@Controller('jamendo')
export class JamendoController {
  constructor(private readonly jamendoService: JamendoService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.jamendoService.search(query);
  }

  @Get('popular')
  getPopular() {
    return this.jamendoService.getPopular();
  }

  @Get('genre')
  getByGenre(@Query('genre') genre: string) {
    return this.jamendoService.getByGenre(genre);
  }
}
