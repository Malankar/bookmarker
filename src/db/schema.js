import { pgTable, text, varchar, uuid } from 'drizzle-orm/pg-core';

const bookmark = pgTable('bookmark', {
  id: uuid('id').primaryKey(),
  userId: text('userId'),
  title: text('title'),
  url: varchar('url'),
});

export { bookmark };