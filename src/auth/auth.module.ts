import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ENV_KEYS } from '@/constant/constant';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(ENV_KEYS.JWT_ACCESS_EXPIRED_IN),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
