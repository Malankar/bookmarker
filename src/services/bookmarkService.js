import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db.js";
import { bookmark } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { bookmarkSchema } from "../utils/joiSchema.js";
import Joi from "joi";

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
    await Joi.string().uuid().required().validateAsync(id);
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
    await Joi.string().uuid().required().validateAsync(id);
    const result = await db
      .delete(bookmark)
      .where(eq(bookmark.id, id))
      .returning();
    return result.length > 0;
  } catch (error) {
    throw error;
  }
};

const bookmarkService = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkService;