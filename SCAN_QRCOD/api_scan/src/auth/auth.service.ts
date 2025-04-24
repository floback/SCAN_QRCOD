import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginEntity } from '../login/entities/login.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LoginEntity)
    private readonly loginRepository: Repository<LoginEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const login = await this.loginRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!login) throw new UnauthorizedException('Email inválido');

    const passwordValid = await bcrypt.compare(password, login.password);
    if (!passwordValid) throw new UnauthorizedException('Senha inválida');

    return login;
  }

  async login(email: string, password: string) {
    const login = await this.validateUser(email, password);

    const payload = {
      sub: login.id,
      id_user: login.user.id,
      email: login.email,
      type_user: login.user.type_user, // Corrigido aqui
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: login.user.id,
        email: login.email,
        name: login.user.name,
        type_user: login.user.type_user, // Corrigido aqui
      },
    };
  }
}
