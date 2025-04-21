// src/scan/scan.controller.ts
import { Controller, Post, Req, Get, Param } from '@nestjs/common';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { ScanService } from './scan.service';
import { Lookup } from 'geoip-lite';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get(':qrId')
async handleScanGet(@Req() req: Request, @Param('qrId') qrId: string) {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const ipString = typeof ip === 'string' ? ip : '';
  const geo = geoip.lookup(ipString) as Lookup | null;

  const scanData = {
    qrId,
    ip: ipString,
    country: geo?.country || 'Desconhecida',
    city: geo?.city || 'Desconhecida',
    region: geo?.region || 'Desconhecida',
    latitude: geo?.ll?.[0] || null,
    longitude: geo?.ll?.[1] || null,
  };

  console.log('Dados do Scan via GET:', scanData);
  return `
    <html>
      <head><title>Dados do Scan</title></head>
      <body style="font-family: sans-serif; background-color: #f0f0f0; padding: 20px;">
        <h1>Dados do Scan</h1>
        <ul>
          <li><strong>QR ID:</strong> ${scanData.qrId}</li>
          <li><strong>IP:</strong> ${scanData.ip}</li>
          <li><strong>País:</strong> ${scanData.country}</li>
          <li><strong>Estado:</strong> ${scanData.region}</li>
          <li><strong>Cidade:</strong> ${scanData.city}</li>
          <li><strong>Latitude:</strong> ${scanData.latitude}</li>
          <li><strong>Longitude:</strong> ${scanData.longitude}</li>
        </ul>
      </body>
    </html>
  `;
  }
}

