const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');

router.get('/bookmarks', bookmarkController.getAllBookmarks);
router.get('/bookmarks/:id', bookmarkController.getBookmarkById);
router.post('/bookmarks', bookmarkController.createBookmark);
router.delete('/bookmarks/:id', bookmarkController.deleteBookmarkById);

module.exports = router;