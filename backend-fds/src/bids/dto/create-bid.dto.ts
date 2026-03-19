import { IsNumber, IsPositive } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsPositive()
  bidAmountClp: number;

  @IsNumber()
  @IsPositive()
  productionDays: number;
}
