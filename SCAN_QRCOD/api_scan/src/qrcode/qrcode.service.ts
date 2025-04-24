// src/qrcode/qrcode.service.ts
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrcodeEntity } from './entities/qrcode.entity';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(QrcodeEntity)
    private readonly qrcodeRepository: Repository<QrcodeEntity>,
  ) {}

  async generate(dto: CreateQrcodeDto) {
    const baseUrl = process.env.QR_BASE_URL?.trim();
    const url = `${baseUrl}/scan/${dto.code}`;

    const image = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
    });

    const newQr = this.qrcodeRepository.create({
      code: dto.code,
      description: dto.description,
      user: { id: dto.id_user } as UserEntity,
      img: image, // ✅ Nome correto do campo na entidade
    });
    

    const saved = await this.qrcodeRepository.save(newQr);

    console.log('✅ QR Code salvo:', saved);

    return {
      message: 'QR Code gerado e salvo com sucesso',
      id: saved.id,
      id_user: saved.user?.id,
      code: saved.code,
      creationDate: saved.creationDate,
      image: saved.img,
    };
  }
}
