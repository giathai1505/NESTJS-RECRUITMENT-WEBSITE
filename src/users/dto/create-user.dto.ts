import { IsNotEmpty, IsEmail, isNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  name: string;
  @IsNotEmpty()
  password: string;
}
