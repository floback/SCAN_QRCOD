import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
