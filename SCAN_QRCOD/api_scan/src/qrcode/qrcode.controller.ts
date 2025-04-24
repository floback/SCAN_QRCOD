// src/qrcode/qrcode.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { JwtAuthGuard } from 'src/auth/guard/jtw-auth-guard';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generateAndSave(@Body() dto: CreateQrcodeDto) {
    return await this.qrcodeService.generate(dto);
  }
}
