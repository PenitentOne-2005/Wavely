import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto';
import { UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user.id });
    return { token, userId: user.id };
  }

  async login(dto: AuthDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id });
    return { token, userId: user.id };
  }
}
