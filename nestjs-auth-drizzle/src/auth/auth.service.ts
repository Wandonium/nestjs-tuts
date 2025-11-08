import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    let user = await this.usersService.findOneByEmail(req.user.email);
    if (!user) {
      // Create a new user if they don't exist
      // This is a simplified example. You might want to handle this differently.
      user = await this.usersService.create({
        email: req.user.email,
        password: '', // Social logins don't have a password
      });
    }

    return this.login(user);
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    let user = await this.usersService.findOneByEmail(req.user.email);
    if (!user) {
      // Create a new user if they don't exist
      user = await this.usersService.create({
        email: req.user.email,
        password: '', // Social logins don't have a password
      });
    }

    return this.login(user);
  }
}
