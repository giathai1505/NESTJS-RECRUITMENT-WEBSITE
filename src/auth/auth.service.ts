import { IUser } from '@/users/user.interface';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);

    if (!user) return null;
    const isValidPass = this.usersService.isValidPassword(pass, user.password);
    if (isValidPass) return user;
  }

  async login(user: IUser) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: 'Access Token',
      iss: 'server',
      _id,
      email,
      name,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      email,
      name,
      role,
    };
  }
}
