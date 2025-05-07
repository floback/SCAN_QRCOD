import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto, ResetPasswordDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}


  @Post('recovery-password')
  async sendRecoveryEmail(@Body('email') email: string) {
    return await this.emailService.sendRecoveryEmail(email);
  }
  

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = body;
  
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem.');
    }
  
    return this.emailService.resetPassword(token, newPassword);
  }
}
