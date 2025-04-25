// src/scan/scan.controller.ts
import { Controller, Get, Req, Param, Post, Body, Res } from '@nestjs/common';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { ScanService } from './scan.service';
import { Lookup } from 'geoip-lite';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get(':qrId')
  async handleScanGet(@Req() req: Request, @Param('qrId') qrId: string, @Res() res: any) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
  
    const ipString = typeof ip === 'string' ? ip : '';
    const geo = geoip.lookup(ipString) as Lookup | null;
  
    // 👉 Busca o QR Code pelo código
    const qr = await this.scanService.findByCode(qrId);
    if (!qr) {
      return res.status(404).send('QR Code não encontrado!');
    }
  
    const scanData = {
      qrId,
      ip: ipString,
      country: geo?.country || 'Desconhecida',
      city: geo?.city || 'Desconhecida',
      region: geo?.region || 'Desconhecida',
    };
  
    // 👉 Redirecionamento baseado nos dados
    const redirectTo = qr.number_fone
      ? `https://wa.me/${qr.number_fone}`
      : qr.link_add;
  
    // Envia HTML com JS para capturar GPS + depois redirecionar
    return res.send(`
      <html>
        <head>
          <title>Redirecionando...</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; text-align: center; margin-top: 50px; }
          </style>
        </head>
        <body>
          <h2>QR Code escaneado com sucesso!</h2>
          <p><strong>IP:</strong> ${scanData.ip}</p>
          <p><strong>Localização estimada:</strong> ${scanData.city}, ${scanData.region} - ${scanData.country}</p>
          <p id="gps-info">Buscando localização precisa...</p>
  
          <script>
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;
  
                document.getElementById('gps-info').innerHTML = 
                  '📍 GPS: ' + latitude + ', ' + longitude;
  
                try {
                  await fetch('/scan/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id_qrcode: '${scanData.qrId}',
                      ip: '${scanData.ip}',
                      country: '${scanData.country}',
                      city: '${scanData.city}',
                      region: '${scanData.region}',
                      latitude,
                      longitude
                    })
                  });
                } catch (err) {
                  console.error('Erro ao salvar GPS:', err);
                }
  
                // Aguarda 2 segundos e redireciona
                setTimeout(() => {
                  window.location.href = '${redirectTo}';
                }, 2000);
              },
              (err) => {
                document.getElementById('gps-info').innerHTML = 
                  'Erro ao obter localização: ' + err.message;
  
                setTimeout(() => {
                  window.location.href = '${redirectTo}';
                }, 2000);
              },
              { enableHighAccuracy: true }
            );
          </script>
        </body>
      </html>
    `);
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
