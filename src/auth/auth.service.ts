import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);

    if (!user) return null;
    const isValidPass = this.usersService.isValidPassword(pass, user.password);
    if (isValidPass) return user;
  }
}
