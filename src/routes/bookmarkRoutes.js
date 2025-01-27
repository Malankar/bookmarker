import bookmarkController from '../controllers/bookmarkController.js';
import express from 'express';

const router = express.Router();

router.get('/bookmarks', bookmarkController.getAllBookmarks);
router.get('/bookmarks/:id', bookmarkController.getBookmarkById);
router.post('/bookmarks', bookmarkController.createBookmark);
router.put('/bookmarks/:id', bookmarkController.updateBookmarkById);
router.delete('/bookmarks/:id', bookmarkController.deleteBookmarkById);

export default router;