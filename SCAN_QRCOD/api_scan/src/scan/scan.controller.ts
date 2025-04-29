// src/scan/scan.controller.ts
import { Controller, Get, Req, Param, Post, Body, Res, Delete, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import { ScanService } from './scan.service';
import { Lookup } from 'geoip-lite';
import { Roles } from 'src/auth/decoraters/ roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jtw-auth-guard';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) { }

  @Get(':Id')
  async handleScanGet(@Req() req: Request, @Param('qrId') qrId: string, @Res() res: Response) {
    const rawIp =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const ipString = typeof rawIp === 'string' ? rawIp : '';
    const geo = geoip.lookup(ipString) as Lookup | null;

    console.log('🔎 IP:', ipString);
    console.log('🌍 Geo:', geo);

    const qr = await this.scanService.findByCode(qrId);
    if (!qr) {
      return res.status(404).send('QR Code não encontrado!');
    }

    const latitude = geo?.ll?.[0] ?? null;
    const longitude = geo?.ll?.[1] ?? null;

    const scanData = {
      id_qrcode: qr.id,
      ip: ipString,
      country: geo?.country || 'Desconhecido',
      city: geo?.city || 'Desconhecida',
      region: geo?.region || 'Desconhecida',
      latitude,
      longitude,
    };

    const redirectTo = qr.number_fone
      ? `https://wa.me/${qr.number_fone}`
      : qr.link_add;

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
          <p><strong>Latitude:</strong> ${scanData.latitude ?? 'Não disponível'}</p>
          <p><strong>Longitude:</strong> ${scanData.longitude ?? 'Não disponível'}</p>
          <p>Redirecionando em instantes...</p>

          <script>
            fetch('/scan/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(${JSON.stringify(scanData)})
            }).then(res => res.json())
              .then(data => {
                console.log('📍 Dados salvos com sucesso:', data);
              })
              .catch(err => {
                document.body.innerHTML += '<p style="color:red;">Erro ao salvar localização: ' + err + '</p>';
              });

            setTimeout(() => {
              window.location.href = '${redirectTo}';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }


  @Post('save')
  async handleGpsSave(@Body() body: any) {
    const saved = await this.scanService.create(body);
    console.log('📍 Dados de scan salvos:', saved);
    return { message: 'Localização registrada com sucesso!', data: saved };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER, Role.VIWER)
  @Get()
  async getAllScans() {
    return await this.scanService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER, Role.VIWER)
  @Get(':id')
  async getScanById(@Param('id') id: string) {
    return await this.scanService.findById(id);
  }

  @Get('find/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER, Role.VIWER)
  async findById(@Param('id') id: string) {
    return await this.scanService.findById(id);
}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @Delete(':id')
  async deleteScan(@Param('id') id: string) {
    return await this.scanService.delete(id);
  }
}
