import { pgTable, text, varchar, uuid } from 'drizzle-orm/pg-core';

const bookmark = pgTable('bookmark', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  url: varchar('url', { length: 256 }),
});

const user = pgTable('user', {
  id: uuid('id').primaryKey(),
  username: text('username'),
  password: text('password'),
});

export { bookmark, user };