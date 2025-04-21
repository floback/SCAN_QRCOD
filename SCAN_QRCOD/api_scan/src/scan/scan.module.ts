import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { ScanEntity } from './entities/scan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScanEntity])], // 👈 Isso aqui é obrigatório!
  controllers: [ScanController],
  providers: [ScanService],
})
export class ScanModule {}
