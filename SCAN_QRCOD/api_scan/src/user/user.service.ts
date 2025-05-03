import { All, BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserType } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
    
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);

    if (!user.email){
      throw new HttpException.
    }
    console.log(createUserDto)
    return await this.userRepository.save(user);
  }


}


