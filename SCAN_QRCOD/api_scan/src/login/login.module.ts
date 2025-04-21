import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoginEntity } from './entities/login.entity'; // ajuste o caminho se necessário

@Module({
  imports: [TypeOrmModule.forFeature([LoginEntity])],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [TypeOrmModule], // exporta se outro módulo (ex: UserModule) precisar usar também
})
export class LoginModule {}
