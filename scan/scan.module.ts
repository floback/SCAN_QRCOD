import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { ScanEntity } from './entities/scan.entity';
import { QrcodeEntity } from 'src/qrcode/entities/qrcode.entity'; // 👈 importar aqui

@Module({
  imports: [TypeOrmModule.forFeature([ScanEntity, QrcodeEntity])], // 👈 registra os dois aqui
  controllers: [ScanController],
  providers: [ScanService],
})
export class ScanModule {}
