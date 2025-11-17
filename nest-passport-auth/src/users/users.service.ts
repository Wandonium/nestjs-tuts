import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      refresh_token: '',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      refresh_token: '',
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findById(userId: number) {
    return this.users.find((usr) => usr.userId === userId);
  }
}
