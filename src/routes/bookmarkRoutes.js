import userBookmarkController from '../controllers/bookmarkController.js';
import serverBookmarkController from '../controllers/serverBookmarkController.js';
import express from 'express';
import { authHandler, jwtCheck } from '../middleware/authHandler.js';

const router = express.Router();

router.get('/bookmarks', authHandler(), userBookmarkController.getAllBookmarks);
router.get('/bookmarks/:id', authHandler(), userBookmarkController.getBookmarkById);
router.post('/bookmarks', authHandler(), userBookmarkController.createBookmark);
router.put('/bookmarks/:id', authHandler(), userBookmarkController.updateBookmarkById);
router.delete('/bookmarks/:id', authHandler(), userBookmarkController.deleteBookmarkById);

router.get('/api/bookmarks', jwtCheck, serverBookmarkController.getAllBookmarks);
router.get('/api/bookmarks/:id', jwtCheck, serverBookmarkController.getBookmarkById);

export default router;