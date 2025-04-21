// src/qrcode/qrcode.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Get(':qrId')
  async getQRCode(@Param('qrId') qrId: string) {
    const data = await this.qrcodeService.generate(qrId);
    return {
      message: 'QR Code gerado com sucesso',
      ...data,
    };
  }
}
