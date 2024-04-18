import { IsNotEmpty, IsEmail, isNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  logo: string;
}
