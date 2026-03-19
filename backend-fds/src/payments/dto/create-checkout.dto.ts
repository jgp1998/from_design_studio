import { IsNumber, IsPositive } from 'class-validator';

export class CreateCheckoutDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
