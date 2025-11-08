import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: text('password'),
  roles: roles('roles').array().default(['USER']),
  googleId: varchar('google_id', { length: 256 }),
  facebookId: varchar('facebook_id', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
