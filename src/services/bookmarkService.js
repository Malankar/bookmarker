const { v4: uuidv4 } = require("uuid");
const { db } = require("../db/db");
const { bookmark } = require("../db/schema");
const { eq } = require("drizzle-orm");
const { bookmarkSchema } = require("../utils/joiSchema");
const Joi = require("joi");

const getAllBookmarks = async () => {
  try {
    const result = await db.select().from(bookmark);
    return result;
  } catch (error) {
    throw error;
  }
};

const getBookmarkById = async (id) => {
  try {
    await Joi.string().uuid().required().label("id").validateAsync(id);
    const result = await db.select().from(bookmark).where(eq(bookmark.id, id));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw error;
  }
};

const createBookmark = async (title, url) => {
  try {
    await bookmarkSchema.validateAsync({ title, url });
    const id = uuidv4();

    const newBookmark = await db
      .insert(bookmark)
      .values({ id, title, url })
      .returning();
    return newBookmark[0]; // Assuming .returning() gives an array
  } catch (error) {
    throw error;
  }
};

const deleteBookmarkById = async (id) => {
  try {
    await Joi.string().uuid().required().label("id").validateAsync(id);
    const result = await db
      .delete(bookmark)
      .where(eq(bookmark.id, id))
      .returning();
    return result.length > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};
