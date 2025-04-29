import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrcodeEntity } from './entities/qrcode.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';

@Injectable()
export class QrcodeService {

  constructor(
    @InjectRepository(QrcodeEntity)
    private readonly qrcodeRepository: Repository<QrcodeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

 
  async createQRCode(
    id_user: string,
    number_fone: string,
    link_add: string,
  ): Promise<QrcodeEntity> {
    // 1. Gera um código único usando UUID
    const uniqueCode = uuidv4();
  
    // 2. Define o link que será redirecionado após o scan (salvo no banco)
    let finalLink = link_add;
    if (!finalLink && number_fone) {
      finalLink = `https://wa.me/${number_fone}`;
    }
  
    // 3. Monta o link que vai dentro do QR Code (aponta para o backend)
    const backendBaseUrl = process.env.BASE_URL || 'https://66fc-132-255-43-78.ngrok-free.app'; // <-- troque para seu domínio real
    const qrRedirectLink = `${backendBaseUrl}/scan/${uniqueCode}`;
  
    // 4. Gera a imagem Base64 do QR Code com o link do backend
    const img = await QRCode.toDataURL(qrRedirectLink);
  
    // 5. Log para debug
    console.log('Código único gerado: ', uniqueCode);
    console.log('Link de redirecionamento final: ', finalLink);
    console.log('Link dentro do QR Code (scan): ', qrRedirectLink);
  
    // 6. Cria e salva no banco
    const qrcode = this.qrcodeRepository.create({
      id_user,
      code: uniqueCode,
      img,
      status: true,
      link_add: finalLink,     // salvo para uso posterior no redirecionamento
      number_fone,
    });
  
    return await this.qrcodeRepository.save(qrcode);
  }
  
  
  

  // Método para encontrar um QRCode por ID
  async findById(id: string): Promise<QrcodeEntity | null> {
    return await this.qrcodeRepository.findOne({ where: { id } });
  }

    // qrcode.service.ts
  async findAll(): Promise<QrcodeEntity[]> {
    return await this.qrcodeRepository.find();
  }

  // Método para deletar um QRCode
  async delete(id: string): Promise<string> {
    await this.qrcodeRepository.delete(id);
    return `QRCode com id ${id} deletado com sucesso.`;
  }

  // Método para abrir o WhatsApp com o número de telefone
  openWhatsapp(number_fone: string): string {
    return `https://wa.me/${number_fone}`;
  }

  // Método para ativar o QR Code
  async activateQRCode(id: string): Promise<QrcodeEntity> {
    const qrcode = await this.qrcodeRepository.findOne({ where: { id } });
    if (qrcode) {
      qrcode.status = true;
      return await this.qrcodeRepository.save(qrcode);
    }
    throw new Error('QRCode não encontrado');
  }

  // Método para desativar o QR Code
  async deactivateQRCode(id: string): Promise<QrcodeEntity> {
    const qrcode = await this.qrcodeRepository.findOne({ where: { id } });
    if (qrcode) {
      qrcode.status = false;
      return await this.qrcodeRepository.save(qrcode);
    }
    throw new Error('QRCode não encontrado');
  }

  async update(id: string, createQrcodeDto: CreateQrcodeDto): Promise<QrcodeEntity> {
    const qrcode = await this.qrcodeRepository.findOne({ where: { id } });

    if (!qrcode) {
      throw new NotFoundException(`QR Code com ID ${id} não encontrado.`);
    }

    const updatedQrcode = Object.assign(qrcode, createQrcodeDto);

    return await this.qrcodeRepository.save(updatedQrcode);
  }
}
