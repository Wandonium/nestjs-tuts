import { Module } from '@nestjs/common';
import { db } from './index';

export const DrizzleProvider = {
  provide: 'DRIZZLE_ORM',
  useValue: db,
};

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule {}
