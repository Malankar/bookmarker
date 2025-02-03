import { pgTable, text, varchar, uuid } from 'drizzle-orm/pg-core';

const bookmark = pgTable('bookmark', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  url: varchar('url'),
});

export { bookmark };