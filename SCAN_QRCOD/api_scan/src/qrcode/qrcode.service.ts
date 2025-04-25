import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrcodeEntity } from './entities/qrcode.entity';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { randomUUID } from 'crypto';
import Jimp from 'jimp';


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

    // 1. Gera o QR como buffer (não como DataURL ainda!)
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
    });

    // 2. Lê QR e logo
    const qrImage = await Jimp.read(qrBuffer);
    const logo = await Jimp.read('./src/qrcode/logo.jpeg');

    // 3. Redimensiona a logo
    logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

    // 4. Calcula posição central
    const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
    const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;

    // 5. Junta logo com QR
    qrImage.composite(logo, x, y);

    // 6. Converte imagem final para base64
    const finalBuffer = await qrImage.getBufferAsync(Jimp.MIME_PNG);
    const image = `data:image/png;base64,${finalBuffer.toString('base64')}`;

    // 7. Salva no banco
    const newQr = this.qrcodeRepository.create({
      code,
      img: image,
      link_add: dto.link_add,
      number_fone: dto.number_fone,
    });

    const saved = await this.qrcodeRepository.save(newQr);

    return {
      message: 'QR Code com logo gerado e salvo com sucesso',
      data: saved,
    };
  }
}
