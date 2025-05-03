import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Post('recover-password')
  // async recoverPassword(@Body() dto: CreateEmailDto) {
  //   const result = await this.emailService.recoverPassword(dto);
  //   return { message: result };
  // }
}
