import { Public, ResponseMessage } from '@/decorators/customizeDecorators';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { RegisterUserDto } from '@/users/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage('Create new user successfully!!')
  @Post('/register')
  handleRegister(@Body() body: RegisterUserDto) {
    return this.userService.register(body);
  }
}
