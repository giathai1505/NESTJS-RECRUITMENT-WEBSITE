import { IUser } from '@/users/user.interface';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);

    if (!user) return null;
    const isValidPass = this.usersService.isValidPassword(pass, user.password);
    if (isValidPass) return user;
  }

  async login(user: IUser, res: Response) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: 'Access Token',
      iss: 'server',
      _id,
      email,
      name,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);

    this.usersService.updateUserRefreshToken(refreshToken, _id);

    res.cookie('resfresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED_IN')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  }

  createRefreshToken = (payload: any): string => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED_IN'),
    });

    return refreshToken;
  };

  handleRefreshToken = async (refreshToken: string, res: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      const user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        const { _id, email, name, role } = user;

        const payload = {
          sub: 'Access Token',
          iss: 'server',
          _id,
          email,
          name,
          role,
        };

        const refreshToken = this.createRefreshToken(payload);

        this.usersService.updateUserRefreshToken(refreshToken, _id.toString());

        res.clearCookie('resfresh_token');
        res.cookie('resfresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED_IN')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role,
          },
        };
      } else {
        throw new BadRequestException('Invalid refresh token');
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  handleLogout = async (res: Response, user: IUser) => {
    await this.usersService.clearRefreshToken(user._id);
    res.clearCookie('resfresh_token');
    return 'ok';
  };
}
