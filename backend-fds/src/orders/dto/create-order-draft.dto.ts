import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOrderDraftDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  infillPercentage: number;
}
