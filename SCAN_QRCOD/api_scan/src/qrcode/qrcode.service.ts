// src/qrcode/qrcode.service.ts
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrcodeService {
  async generate(qrId: string): Promise<{ qrId: string; image: string; url: string }> {
    const baseUrl = process.env.QR_BASE_URL?.trim() || 'https://1638-132-255-43-198.ngrok-free.app';
    const url = `${baseUrl}/scan/${qrId}`;

    const image = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
    });

    return {
      qrId,
      image,
      url,
    };
  }
}
