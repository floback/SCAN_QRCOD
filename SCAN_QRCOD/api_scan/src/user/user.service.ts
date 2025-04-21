import { All, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity'
import { throwError } from 'rxjs';
import { LoginEntity } from 'src/login/entities/login.entity';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LoginEntity) private readonly loginRepository: Repository<LoginEntity>
  ) {}
    
  // CREATE USER  
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    
    if (existingUser) {
      throw new BadRequestException('Este e-mail já está cadastrado');
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,  // A senha agora será salva em hash
    });
    const user = await this.userRepository.save(newUser);
  
    // Criação do login
    const newLogin = this.loginRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      user: user,
    });
    await this.loginRepository.save(newLogin);
    
    console.log(user)
    return user;
  }
  
  // FIND ID USER
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (!user){
      throw new NotFoundException(`User id ${ id } not found`);
    }
    console.log(user);
    return user;
  }

  // FIND ALL
  async findAll(): Promise<UserEntity[]> {
    console.log(this.findAll)
    return await this.userRepository.find();
      }
  

  // REMOVE com cascata manual
  async remove(id: string): Promise<{ message: string; userId: string }> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['logins'] });

    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    // 💡 Remove todos os logins relacionados ao usuário
    await this.loginRepository.delete({ user: { id: user.id } });

    // 💣 Agora remove o usuário
    await this.userRepository.remove(user);

    return { message: 'Usuário e login removidos com sucesso!', userId: id };
  }

  // UPDATE do usuário + sincronização do login
async update(id: string, createUserDto: CreateUserDto): Promise<UserEntity> {
  const user = await this.userRepository.findOne({ where: { id }, relations: ['logins'] });

  if (!user) {
    throw new NotFoundException(`User id ${id} not found`);
  }

  // Validação de e-mail duplicado
  if (createUserDto.email) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('Este e-mail já está em uso por outro usuário.');
    }
  }

  // Validação da força da senha
  if (createUserDto.password && createUserDto.password.length < 6) {
    throw new BadRequestException('A senha deve conter no mínimo 6 caracteres.');
  }

  if (createUserDto.password) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
  }

  await this.userRepository.update(id, createUserDto);

  // sincronização do login (relacionado ao user)
  const login = await this.loginRepository.findOne({ where: { user: { id } } });

  if (login) {
    login.email = createUserDto.email ?? login.email;
    login.password = createUserDto.password ?? login.password;
    await this.loginRepository.save(login);
  }
  const updatedUser = await this.userRepository.findOne({ where: { id } });

  if (!updatedUser) {
    throw new NotFoundException(`Usuário com id ${id} não encontrado após atualização.`);
  }
  
  return updatedUser;
}

}
