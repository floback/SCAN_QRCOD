import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      type_user: user.type_user,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      expires_in: '1d',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type_user: user.type_user,
      },
    };
  }
}
