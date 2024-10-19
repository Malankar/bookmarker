import asyncHandler from "express-async-handler";
import bookmarkService from "../services/bookmarkService.js";
import { ContentTypeMismatchError } from "../utils/customError.js";

const getAllBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.getAllBookmarks();
  res.status(200).json({
    data: bookmarks,
  });
});

const getBookmarkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await bookmarkService.getBookmarkById(id);
  if (!data) {
    return res.status(404).json({
      message: "Bookmark not found",
    });
  }
  res.status(200).json({
    data,
  });
});

const createBookmark = asyncHandler(async (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    throw ContentTypeMismatchError("Content-Type must be application/json");
  }
  const { title, url } = req.body;
  const { bookmark } = await bookmarkService.createBookmark(title, url);
  return res.status(201).json({
    data: bookmark,
  });
});

const deleteBookmarkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await bookmarkService.deleteBookmarkById(id);
  return res.status(204).send();
});

const bookmarkController = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkController;