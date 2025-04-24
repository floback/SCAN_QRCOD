// src/scan/scan.controller.ts
import { Controller, Get, Req, Param, Post, Body } from '@nestjs/common';
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
      // latitude e longitude via IP **não serão mais usadas**
    };

    console.log('🔎 Dados do scan (sem GPS):', {
      qrId: scanData.qrId,
      ip: scanData.ip,
      country: scanData.country,
      city: scanData.city,
      region: scanData.region,
    });

    return `
      <html>
        <head>
          <title>Scan Detected</title>
          <style>
            body {
              font-family: sans-serif;
              background-color: #f0f0f0;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <h1>QR escaneado!</h1>
          <p><strong>QR ID:</strong> ${scanData.qrId}</p>
          <p><strong>IP:</strong> ${scanData.ip}</p>
          <p><strong>Localização por IP:</strong> ${scanData.city}, ${scanData.region} - ${scanData.country}</p>
          <p id="gps-info"><em>Buscando localização precisa...</em></p>

<script>
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      console.log("📍 GPS REAL:", latitude, longitude);
      document.getElementById('gps-info').innerHTML = 
        '<strong>GPS Preciso:</strong> Latitude: ' + latitude + ', Longitude: ' + longitude;

      try {
        await fetch('http://172.22.3.190:3000/scan/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_qrcode: '${scanData.qrId}',
            ip: '${scanData.ip}',
            country: '${scanData.country}',
            city: '${scanData.city}',
            region: '${scanData.region}',
            latitude: latitude,
            longitude: longitude,
          })
        });
      } catch (fetchErr) {
        console.error("❌ Erro ao enviar dados para o servidor:", fetchErr);
      }
    },
    (err) => {
      console.log("❌ Erro ao obter localização:", err.message);
      document.getElementById('gps-info').innerHTML = 
        '<strong>Erro ao obter localização:</strong> ' + err.message;
    },
    { enableHighAccuracy: true }
  );
</script>
        </body>
      </html>
    `;
  }

  @Post('save')
  async handleGpsSave(@Body() body: any) {
    const saved = await this.scanService.create(body);
    console.log('📍 GPS REAL SALVO no banco:', {
      id_qrcode: body.id_qrcode,
      latitude: body.latitude,
      longitude: body.longitude,
      ip: body.ip,
      cidade: body.city,
      estado: body.region,
      pais: body.country,
    });
    console.log(saved)
    return { message: 'Localização GPS salva com sucesso!', data: saved };
  }
}
