import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createCategory(category: typeof schema.categories.$inferInsert) {
    return await this.database
      .insert(schema.categories)
      .values(category)
      .returning();
  }

  async addToPost(
    postToCategory: typeof schema.postsToCategories.$inferInsert,
  ) {
    await this.database.insert(schema.postsToCategories).values(postToCategory);
  }

  async getCategories() {
    return this.database.query.categories.findMany({
      with: { postsToCategories: true },
    });
  }
}
