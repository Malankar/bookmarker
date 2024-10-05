const bookmarkService = require("../services/bookmarkService");

const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await bookmarkService.getAllBookmarks();
    res.status(200).json({
      message: "Bookmarks retrieved successfully",
      data: bookmarks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ type: "Internal Server Error", message: error.message });
  }
};

const getBookmarkById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await bookmarkService.getBookmarkById(id);
    if (!data) {
      return res.status(404).json({
        message: "Bookmark not found",
      });
    }
    res.status(200).json({
      message: "Bookmark retrieved successfully",
      data,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        type: error.name,
        message: error.message,
      });
    } else {
      return res
        .status(500)
        .json({ type: "Internal Server Error", message: error.message });
    }
  }
};

const createBookmark = async (req, res) => {
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
      message: "Bookmark created successfully",
      data: bookmark,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        type: error.name,
        message: error.message,
      });
    } else {
      return res
        .status(500)
        .json({ type: "Internal Server Error", message: error.message });
    }
  }
};

const deleteBookmarkById = async (req, res) => {
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
    if (error.name === "ValidationError") {
      return res.status(400).json({
        type: error.name,
        message: error.message,
      });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};
