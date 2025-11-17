/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  validateUserRefreshToken(refreshToken: string, userId: number) {
    try {
      console.log('userId: ', userId);
      const user = this.userService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found!');
      //   const authenticated = await compare(refreshToken, user.refresh_token);
      const authenticated = refreshToken === user.refresh_token;
      if (!authenticated)
        throw new UnauthorizedException('Refresh token not found!');
      return user;
    } catch (err) {
      console.error(
        '[auth.service.ts] - validateUserRefreshToken - error: ',
        err,
      );
      throw new UnauthorizedException('Refresh token not valid!');
    }
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '15s',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    console.log(
      'updated user: ',
      this.userService.updateUser({ ...user, refresh_token }),
    );
    return {
      access_token,
      refresh_token,
    };
  }
}
