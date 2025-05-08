import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateQrcodeDto {
  @IsString()
  link_add: string;

  @IsNumber()
  number_fone: number;

  @IsOptional()
  status?: boolean;

  @IsOptional()
  @IsString()
  code?: string;
}
