import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrcodeService } from './qrcode.service';
import { QrcodeController } from './qrcode.controller';
import { QrcodeEntity } from './entities/qrcode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QrcodeEntity])],
  controllers: [QrcodeController],
  providers: [QrcodeService],
})
export class QRCodeModule {}
