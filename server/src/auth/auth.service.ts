import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    const token = this.jwtService.sign({ id: user.id });
    return { token, userId: user.id };
  }

  async login(dto: AuthDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id });
    return { token, userId: user.id };
  }
}
