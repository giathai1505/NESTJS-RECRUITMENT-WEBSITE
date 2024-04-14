import {
  Public,
  ResponseMessage,
  User,
} from '@/decorators/customizeDecorators';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { RegisterUserDto } from '@/users/dto/register-user.dto';
import { IUser } from '@/users/user.interface';
import { Response as TResponse, Request as TRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage('Login successfully!')
  handleLogin(
    @Request() req: TRequest & { user: IUser },
    @Response({ passthrough: true }) res: TResponse,
  ) {
    return this.authService.login(req.user, res);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/account')
  @ResponseMessage('Get user information successfully!')
  getAccountData(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('Create new user successfully!')
  @Post('/register')
  handleRegister(@Body() body: RegisterUserDto) {
    return this.userService.register(body);
  }

  @Public()
  @ResponseMessage('Refresh token successfully!')
  @Post('/refresh')
  handleRefreshToken(
    @Req() req: TRequest,
    @Response({ passthrough: true }) res: TResponse,
  ) {
    const refreshToken = req.cookies['resfresh_token'];
    if (!refreshToken) throw new BadRequestException('Invalid refresh token');

    return this.authService.handleRefreshToken(refreshToken, res);
  }

  @ResponseMessage('Logout successfully!')
  @Post('/logout')
  logout(@User() user: IUser, @Response({ passthrough: true }) res: TResponse) {
    return this.authService.handleLogout(res, user);
  }
}
