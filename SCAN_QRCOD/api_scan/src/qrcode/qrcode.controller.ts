import { Controller, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { JwtAuthGuard } from '../auth/guard/jtw-auth-guard';
import { Roles } from 'src/auth/decoraters/ roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() dto: CreateQrcodeDto, @Request() req) {
    const userId = req.user?.id; // Extraído do token JWT
    return this.qrcodeService.generate(dto, userId);
  }

  
  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.qrcodeService.delete(id);
  }
}
