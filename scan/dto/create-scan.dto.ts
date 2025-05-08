// src/scan/dto/scan.dto.ts
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class ScanDto {
  @IsUUID()
  qrId: string;

  @IsString()
  ip: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  altitude?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;

  @IsOptional()
  @IsNumber()
  speed?: number;
}
