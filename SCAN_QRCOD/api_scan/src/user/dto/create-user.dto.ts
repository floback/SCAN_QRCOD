import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

 export enum  UserType  {
  owner = 'OWNER',
  admin = 'ADMIN',
  user = 'USER',
  viwer = 'VIWER'
}
export class CreateUserDto {

  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsOptional()
  type_user?: UserType;


  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
