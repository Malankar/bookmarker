import bookmarkService from "../services/bookmarkService.js";

const getAllBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await bookmarkService.getAllBookmarks();
    res.status(200).json({
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

const getBookmarkById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const createBookmark = async (req, res, next) => {
  try {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(415).json({
        type: "Content Type Mismatch",
        message: "Content type must be application/json",
      });
    }
    const { title, url } = req.body;
    const { bookmark } = await bookmarkService.createBookmark(title, url);
    return res.status(201).json({
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBookmarkById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await bookmarkService.deleteBookmarkById(id);
    if (!data) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }
    return res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

const bookmarkController = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};

export default bookmarkController;