// src/scan/scan.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScanEntity } from './entities/scan.entity';
import { QrcodeEntity } from 'src/qrcode/entities/qrcode.entity';

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(ScanEntity)
    private readonly scanRepository: Repository<ScanEntity>,
    @InjectRepository(QrcodeEntity)
    private readonly qrcodeRepository: Repository<QrcodeEntity>,
  ) {}

  async create(data: Partial<ScanEntity>) {
    const scan = this.scanRepository.create(data);
    return await this.scanRepository.save(scan);
  }

  async findByCode(code: string) {
    return this.qrcodeRepository.findOne({ where: { code } });
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
