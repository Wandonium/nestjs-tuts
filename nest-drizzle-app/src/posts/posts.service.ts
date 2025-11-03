import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createPost(post: typeof schema.posts.$inferInsert) {
    return await this.database.insert(schema.posts).values(post).returning();
  }

  async getPosts() {
    return this.database.query.posts.findMany({
      with: { user: true },
    });
  }

  async getPost(postId: number) {
    return this.database.query.posts.findFirst({
      where: eq(schema.posts.id, postId),
    });
  }

  async updatePost(postId: number, post: typeof schema.posts.$inferInsert) {
    return await this.database
      .update(schema.posts)
      .set(post)
      .where(eq(schema.posts.id, postId))
      .returning();
  }
}
