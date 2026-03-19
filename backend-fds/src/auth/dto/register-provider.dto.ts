import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterProviderDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;
}
