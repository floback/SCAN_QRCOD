import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}


export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(4)
  newPassword: string;

  @IsString()
  @MinLength(4)
  confirmPassword: string;
}
