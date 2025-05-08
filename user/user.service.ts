import { All, BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserType } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Email } from '../email/entities/email.entity';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
    
  // CREATE USER
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExisting = this.userRepository.findOne({
      where: { email: createUserDto.email},
    });

    if (!userExisting) {
      throw new ConflictException(`E-mail ${userExisting} already exists`);
    }
    
    const hashePassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashePassword,
    });
    return await this.userRepository.save(user);
  }

  // FIND ALL
  async findAll(): Promise<UserEntity[]>{
    return await this.userRepository.find();
  }

  // FIND BY ID
  async findById( id:  string): Promise<UserEntity>{
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }
    return user;
  }

  //UPDATE USER
  async updateUser( 
    id: string, 
    createUserDto: Partial<CreateUserDto>,
   ): Promise<UserEntity> {
      const user = await this.findById(id);
      
      if (createUserDto.password) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
      }

      if ( createUserDto.email && createUserDto.email !== user.email ) {
        const existing = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
        if (existing) {
            throw new ConflictException(`This is e-mail ${createUserDto.email} existing`);
        }
      }
      const updated = Object.assign( user, createUserDto );
      return await this.userRepository.save(updated);
   }

   //DELETE USER
   async deleteUser(id: string): Promise<{ message: string }>{
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return { message: `User id ${user.id} removed!`};
   }
}


