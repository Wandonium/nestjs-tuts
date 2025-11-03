import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createPost(post: typeof schema.posts.$inferInsert, category?: string) {
    try {
      await this.database.transaction(async (tx) => {
        const posts = await tx.insert(schema.posts).values(post).returning();
        if (category) {
          const categories = await this.categoriesService.createCategory(
            {
              name: category,
            },
            tx,
          );
          await this.categoriesService.addToPost(
            {
              postId: posts[0].id,
              categoryId: categories[0].id,
            },
            tx,
          );
          return { ...posts, ...categories };
        }
        return { posts };
      });
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  /*   async createPost(post: typeof schema.posts.$inferInsert, category?: string) {
    try {
      await this.database.transaction(async (tx) => {
        const posts = await tx
          .insert(schema.posts)
          .values(post)
          .returning({ id: schema.posts.id });
        tx.rollback();
        if (category) {
          throw new Error('Error!!');
          const { id } = await this.categoriesService.createCategory(
            {
              name: category,
            },
            tx,
          );
          await this.categoriesService.addToPost(
            {
              postId: posts[0].id,
              categoryId: id,
            },
            tx,
          );
        }
      });
    } catch (error) {
      console.error('Error: ', error);
    }
  } */

  async getPosts() {
    return this.database.query.posts.findMany({
      with: { user: true, postsToCategories: true },
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
