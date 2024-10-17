import express from 'express';
import bookmarkController from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/bookmarks', bookmarkController.getAllBookmarks);
router.get('/bookmarks/:id', bookmarkController.getBookmarkById);
router.post('/bookmarks', bookmarkController.createBookmark);
router.delete('/bookmarks/:id', bookmarkController.deleteBookmarkById);

export default router;