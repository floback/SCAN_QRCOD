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
    private readonly qrcodeRepository: Repository<QrcodeEntity>,
  ) {}

  async create(data: Partial<ScanEntity>) {
    const scan = this.scanRepository.create(data);
    return await this.scanRepository.save(scan);
  }

  async findByCode(code: string) {
    return this.qrcodeRepository.findOne({ where: { code } });
  }
  
}
