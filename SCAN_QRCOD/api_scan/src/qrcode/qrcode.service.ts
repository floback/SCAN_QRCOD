import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrcodeEntity } from './entities/qrcode.entity';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { randomUUID } from 'crypto';
import { Jimp,  } from 'jimp';
import * as path from 'path';
import * as fs from 'fs';




@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(QrcodeEntity)
    private readonly qrcodeRepository: Repository<QrcodeEntity>,
  ) {}

  async generate(dto: CreateQrcodeDto, userId: string) {
    const baseUrl = process.env.QR_BASE_URL?.trim();
    const code = dto.code || randomUUID();
    const url = `${baseUrl}/scan/${code}`;
  
    // Só gera o QR direto, sem logo
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
    });
  
    const image = `data:image/png;base64,${qrBuffer.toString('base64')}`;
  
    const newQr = this.qrcodeRepository.create({
      code,
      img: image,
      link_add: dto.link_add,
      number_fone: dto.number_fone,
      id_user: { id: userId }, // <- assim funciona
    });

    const saved = await this.qrcodeRepository.save(newQr);
    
    return {
      message: 'QR Code gerado sem logo e salvo com sucesso',
      data: saved,
    };
  }

  async delete(id: string) {
    const qrcode = await this.qrcodeRepository.findOne({ where: { id } });
  
    if (!qrcode) {
      throw new Error('QR Code não encontrado');
    }
  
    await this.qrcodeRepository.remove(qrcode);
  
    return {
      message: `QR Code com id ${id} deletado com sucesso`,
    };
  }
  
  
  
}
