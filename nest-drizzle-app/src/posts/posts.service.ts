import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getPosts() {
    return this.database.query.posts.findMany({
      with: { user: true },
    });
  }

  async createPost(post: typeof schema.posts.$inferInsert) {
    await this.database.insert(schema.posts).values(post);
  }
}
