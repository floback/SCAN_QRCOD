// src/scan/scan.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return await this.scanRepository.find({ order: { create_date: 'DESC' } });
  }

  async findById(id: string) {
    const scan = await this.scanRepository.findOne({ where: { id } });
    if (!scan) {
      throw new NotFoundException(`Registro de scan com ID ${id} não encontrado.`);
    }
    return scan;
  }

  async delete(id: string) {
    const scan = await this.scanRepository.findOne({ where: { id } });
    if (!scan) {
      throw new NotFoundException(`Registro de scan com ID ${id} não encontrado.`);
    }
    await this.scanRepository.remove(scan);
    return { message: `Registro de scan com ID ${id} deletado com sucesso.` };
  }

  // FIND BY ID
  
}
