const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { default: rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later."
    });
  },
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

router.get('/bookmarks', bookmarkController.getAllBookmarks);
router.get('/bookmarks/:id', bookmarkController.getBookmarkById);
router.post('/bookmarks', limiter, bookmarkController.createBookmark);
router.delete('/bookmarks/:id', limiter, bookmarkController.deleteBookmarkById);

module.exports = router;