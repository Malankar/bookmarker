import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db.js";
import { bookmark } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { bookmarkSchema } from "../utils/joiSchema.js";
import Joi from "joi";
import { ConflictError, NotFoundError } from "../utils/customError.js";

const getAllBookmarks = async () => {
  const result = await db.select().from(bookmark);
  return result;
};

const getBookmarkById = async (id) => {
  await Joi.string()
    .uuid()
    .required()
    .label("id")
    .messages({
      "string.guid": "Must be a valid GUID",
    })
    .validateAsync(id);
  const result = await db.select().from(bookmark).where(eq(bookmark.id, id));
  if (result.length === 0) {
    throw NotFoundError("Bookmark not found");
  }
  return result[0];
};

const createBookmark = async (title, url) => {
  // Validate input data
  await bookmarkSchema.validateAsync({ title, url }, { abortEarly: false });

  // Check for existing bookmark with the same URL
  const existingBookmark = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.url, url));

  if (existingBookmark.length) {
    throw ConflictError("Bookmark with this URL already exists");
  }

  const id = uuidv4();
  const newBookmark = await db
    .insert(bookmark)
    .values({ id, title, url })
    .returning();

  return newBookmark[0];
};

const deleteBookmarkById = async (id) => {
  await Joi.string()
    .uuid()
    .required()
    .label("id")
    .messages({
      "string.guid": "Must be a valid GUID",
    })
    .validateAsync(id);
  const result = await db
    .delete(bookmark)
    .where(eq(bookmark.id, id))
    .returning();
  if (result.length === 0) {
    throw NotFoundError("Bookmark not found");
  }
};

const bookmarkService = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkService;
