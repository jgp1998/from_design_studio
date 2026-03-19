import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderGeometryDto {
  @IsNumber()
  @IsNotEmpty()
  volumeCm3: number;

  // Additional geometric data could go here (e.g. dimensions)
}
