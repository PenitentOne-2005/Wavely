import { IsString, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePlaylistDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddTrackDto {
  @IsString()
  jamendoId!: string;

  @IsString()
  title!: string;

  @IsString()
  artist!: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsInt()
  duration!: number;

  @IsString()
  audioUrl!: string;
}
