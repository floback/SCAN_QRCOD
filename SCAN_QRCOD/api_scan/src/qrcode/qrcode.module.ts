import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrcodeService } from './qrcode.service';
import { QrcodeController } from './qrcode.controller';
import { QrcodeEntity } from './entities/qrcode.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([QrcodeEntity]), UserModule],
  controllers: [QrcodeController],
  providers: [QrcodeService],
})
export class QRCodeModule {}
