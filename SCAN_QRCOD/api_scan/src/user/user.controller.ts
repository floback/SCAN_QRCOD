import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jtw-auth-guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decoraters/ roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    console.log(createUserDto)
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Get(':id')
  findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
