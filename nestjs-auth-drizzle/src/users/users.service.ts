import { Inject, Injectable } from '@nestjs/common';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('DRIZZLE_ORM') private readonly drizzle: typeof db) {}

  async findOneByEmail(email: string) {
    return this.drizzle.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findOneById(id: number) {
    return this.drizzle.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async create(createUserDto: CreateUserDto) {
    const [newUser] = await this.drizzle
      .insert(users)
      .values(createUserDto)
      .returning();
    return newUser;
  }
}
