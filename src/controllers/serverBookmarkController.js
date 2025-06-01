import asyncHandler from "express-async-handler";
import bookmarkService from "../services/bookmarkService.js";

const getAllBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.getAllBookmarksWithoutUser();
  res.status(200).json(bookmarks);
});

const getBookmarkById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await bookmarkService.getBookmarkByIdWithoutUser(id);
  if (!data) {
    return res.status(404).json({
      message: "Bookmark not found",
    });
  }
  res.status(200).json(data);
});

const bookmarkController = {
  getAllBookmarks,
  getBookmarkById,
};

export default bookmarkController;
