const { pgTable, text, varchar, uuid } = require('drizzle-orm/pg-core');

const bookmark = pgTable('bookmark', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  url: varchar('url', { length: 256 }),
});

module.exports = { bookmark };
