const bookmarkService = require("../services/bookmarkService");

const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await bookmarkService.getAllBookmarks();
    res.status(200).json({
      data: bookmarks,
    });
  } catch (error) {
    console.log(error);
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
      data,
    });
  } catch (error) {
    console.log(error);
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
      data: bookmark,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

module.exports = {
  getAllBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmarkById,
};
