// src/scan/scan.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScanEntity } from './entities/scan.entity';

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(ScanEntity)
    private readonly scanRepository: Repository<ScanEntity>,
  ) {}

  async create(data: Partial<ScanEntity>) {
    const scan = this.scanRepository.create(data);
    return await this.scanRepository.save(scan);
  }
}
