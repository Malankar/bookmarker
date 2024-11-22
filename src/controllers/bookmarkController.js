import asyncHandler from "express-async-handler";
import bookmarkService from "../services/bookmarkService.js";
import { ContentTypeMismatchError } from "../utils/customError.js";

const getAllBookmarks = asyncHandler(async (req, res) => {
  const userId = req.oidc.user.sid;
  const bookmarks = await bookmarkService.getAllBookmarks(userId);
  res.status(200).json({
    data: bookmarks,
  });
});

const getBookmarkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.oidc.user.sid;
  const data = await bookmarkService.getBookmarkById(id, userId);
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
  const userId = req.oidc.user.sid;
  const { bookmark } = await bookmarkService.createBookmark(title, url, userId);
  return res.status(201).json({
    data: bookmark,
  });
});

const deleteBookmarkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.oidc.user.sid;
  await bookmarkService.deleteBookmarkById(id, userId);
  return res.status(204).send();
});

const bookmarkController = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkController;
