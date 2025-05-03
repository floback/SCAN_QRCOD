import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmailDto } from './dto/create-email.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

  ) {}

  // async recoverPassword(dto: CreateEmailDto): Promise<string> {
  //   const { email, newPassword, confirmPassword } = dto;

  //   if (newPassword !== confirmPassword) {
  //     throw new BadRequestException('As senhas não coincidem');
  //   }

  //   const user = await this.usersRepository.findOne({ where: { email } });

  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado');
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);

  //   // Atualiza a senha na tabela de login
  //   await this.loginRepository.update({ id_user: user.id }, { password: hashedPassword });

  //   return 'Senha atualizada com sucesso!';
  // }
}
