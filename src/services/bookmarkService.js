import { v4 as uuidv4 } from "uuid";
import { db } from "../db/db.js";
import { bookmark } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { bookmarkSchema } from "../utils/joiSchema.js";
import Joi from "joi";
import { ConflictError, NotFoundError } from "../utils/customError.js";

const getAllBookmarks = async (userId) => {
  const result = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.userId, userId));
  return result;
};

const getBookmarkById = async (id, userId) => {
  await Joi.string()
    .uuid()
    .required()
    .label("id")
    .messages({
      "string.guid": "Must be a valid GUID",
    })
    .validateAsync(id);
  const result = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.id, id), eq(bookmark.userId, userId)));
  if (result.length === 0) {
    throw NotFoundError("Bookmark not found");
  }
  return result[0];
};

const createBookmark = async (title, url, userId) => {
  // Validate input data
  await bookmarkSchema.validateAsync({ title, url }, { abortEarly: false });

  // Check for existing bookmark with the same URL
  const existingBookmark = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.url, url), eq(bookmark.userId, userId)));

  if (existingBookmark.length) {
    throw ConflictError("Bookmark with this URL already exists");
  }

  const id = uuidv4();
  const newBookmark = await db
    .insert(bookmark)
    .values({ id, title, url, userId })
    .returning();

  return newBookmark[0];
};

const deleteBookmarkById = async (id, userId) => {
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
    .where(and(eq(bookmark.id, id), eq(bookmark.userId, userId)))
    .returning();
  if (result.length === 0) {
    throw NotFoundError("Bookmark not found");
  }
  return result.length;
};

const bookmarkService = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkService;
