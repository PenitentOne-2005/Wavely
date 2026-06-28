import { Module } from '@nestjs/common';
import { JamendoService } from './jamendo.service';
import { JamendoController } from './jamendo.controller';

@Module({
  controllers: [JamendoController],
  providers: [JamendoService],
})
export class JamendoModule {}
