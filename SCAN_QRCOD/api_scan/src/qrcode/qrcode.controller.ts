import { Controller, Get, Post, Param, Body, Delete, NotFoundException, UseGuards, Patch } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { QrcodeEntity } from './entities/qrcode.entity';
import { JwtAuthGuard } from 'src/auth/guard/jtw-auth-guard';
import { Request } from '@nestjs/common';
import { Roles } from 'src/auth/decoraters/ roles.decorator';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { Role } from 'src/auth/enums/role.enum';




@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @Post()
  async createQRCode(
    @Request() req,
    @Body('number_fone') number_fone: string,
    @Body('link_add') link_add: string,
  ): Promise<QrcodeEntity> {
    const id_user = req.user.id_user;
    return this.qrcodeService.createQRCode(id_user, number_fone, link_add);
  }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.OWNER, Role.ADMIN, Role.USER, Role.VIWER)
    @Get()
    async findAll(): Promise<QrcodeEntity[]> {
      return this.qrcodeService.findAll();
    }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER, Role.VIWER)
   @Get(':id')
   async findById(@Param('id') id: string): Promise<QrcodeEntity> {
     const qrcode = await this.qrcodeService.findById(id);
     if (!qrcode) {
       throw new NotFoundException(`QRCode com ID ${id} não encontrado.`);
     }
     return qrcode;
   }
  
  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER) 
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.qrcodeService.delete(id);
  }


  @Get('whatsapp/:id')
  async openWhatsapp(@Param('id') id: string): Promise<string> {
    const qrcode = await this.qrcodeService.findById(id);
    if (!qrcode) {
      throw new Error('QRCode não encontrado');
    }
    return this.qrcodeService.openWhatsapp(qrcode.number_fone);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createQrcodeDto: CreateQrcodeDto,
  ): Promise<QrcodeEntity> {
    return this.qrcodeService.update(id, createQrcodeDto);
  }
}
