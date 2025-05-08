import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly mailerService: MailerService,
  ) {}

  async sendRecoveryEmail(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('E-mail não encontrado');
    }

    const payload = { id_user: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10m',
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h3>Recuperação de senha</h3>
        <p>Clique no link abaixo para redefinir sua senha. O link expira em 10 minutos.</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return 'E-mail de recuperação enviado com sucesso';
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const id_user = payload.id_user;

      const user = await this.usersRepository.findOne({ where: { id: id_user } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await this.usersRepository.save(user);

      return { message: 'Senha redefinida com sucesso.' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
