import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bookmarkController from '../../src/controllers/bookmarkController.js';
import bookmarkRoutes from '../../src/routes/bookmarkRoutes.js';
import { v4 as uuidv4 } from "uuid";

// Mock the controller functions
vi.mock('../../src/controllers/bookmarkController.js', () => ({
  default: {
    getAllBookmarks: vi.fn(),
    getBookmarkById: vi.fn(),
    createBookmark: vi.fn(),
    deleteBookmarkById: vi.fn()
  }
}));

describe('Bookmark Routes', () => {
  let app;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use(bookmarkRoutes);
  });

  describe('GET /bookmarks', () => {
    it('should call getAllBookmarks controller method', async () => {
      const mockBookmarks = [
        { id: uuidv4(), title: 'First Bookmark', url: 'https://example.com' },
        { id: uuidv4(), title: 'Second Bookmark', url: 'https://example.org' }
      ];
      
      bookmarkController.getAllBookmarks.mockImplementation((req, res) => {
        res.json(mockBookmarks);
      });

      const response = await request(app)
        .get('/bookmarks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(bookmarkController.getAllBookmarks).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockBookmarks);
    });

    it('should call getAllBookmarks controller method', async () => {
      const mockBookmarks = [
        { id: uuidv4(), title: 'First Bookmark', url: 'https://example.com' },
        { id: uuidv4(), title: 'Second Bookmark', url: 'https://example.org' }
      ];
      
      bookmarkController.getAllBookmarks.mockImplementation((req, res) => {
        res.json(mockBookmarks);
      });

      const response = await request(app)
        .get('/bookmarks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(bookmarkController.getAllBookmarks).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockBookmarks);
    });
  });

  describe('GET /bookmarks/:id', () => {
    it('should call getBookmarkById controller method with correct ID', async () => {
      const id = uuidv4();
      const mockBookmark = { id, title: 'Test Bookmark', url: 'https://example.com' };
      
      bookmarkController.getBookmarkById.mockImplementation((req, res) => {
        res.json(mockBookmark);
      });

      const response = await request(app)
        .get(`/bookmarks/${id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(bookmarkController.getBookmarkById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockBookmark);
    });
  });

  describe('POST /bookmarks', () => {
    it('should call createBookmark controller method with request body', async () => {
      const id = uuidv4();
      const newBookmark = { title: 'New Bookmark', url: 'https://example.com' };
      const createdBookmark = { id, ...newBookmark };
      
      bookmarkController.createBookmark.mockImplementation((req, res) => {
        res.status(201).json(createdBookmark);
      });

      const response = await request(app)
        .post('/bookmarks')
        .send(newBookmark)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(bookmarkController.createBookmark).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(createdBookmark);
    });
  });

  describe('DELETE /bookmarks/:id', () => {
    it('should call deleteBookmarkById controller method with correct ID', async () => {
      const id = uuidv4();
      bookmarkController.deleteBookmarkById.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete(`/bookmarks/${id}`)
        .expect(204);

      expect(bookmarkController.deleteBookmarkById).toHaveBeenCalledTimes(1);
    });
  });
});