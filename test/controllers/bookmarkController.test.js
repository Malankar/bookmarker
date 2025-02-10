import { describe, it, expect, vi } from 'vitest';
import bookmarkController from '../../src/controllers/bookmarkController';
import bookmarkService from '../../src/services/bookmarkService';

vi.mock('../../src/services/bookmarkService');

describe('bookmarkController', () => {
  let res;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
  });
  describe('getAllBookmarks', () => {

    it('should return all bookmarks with status 200 when bookmarks exists', async () => {
      const mockBookmarks = [{ id: 1, title: 'Test Bookmark', url: 'http://example.com' }];
      bookmarkService.getAllBookmarks.mockResolvedValue(mockBookmarks);

      const req = {};
    
      await bookmarkController.getAllBookmarks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockBookmarks });
    });

    it("should return 500 and error message if getAllBookmarks fails", async () => {
      const errorMessage = "Database error";
      bookmarkService.getAllBookmarks.mockRejectedValue(new Error(errorMessage));

      const req = {};
    
      const next = vi.fn();

      await bookmarkController.getAllBookmarks(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe(errorMessage);
    });
  });

  describe('getBookmarkById', () => {
    it('should return specific bookmark with status 200 when bookmark exists', async () => {
      const mockBookmarks = { id: 1, title: 'Test Bookmark', url: 'http://example.com' };
      bookmarkService.getBookmarkById.mockResolvedValue(mockBookmarks);

      const req = {
        params: {
          id: 1
        }
      };

      await bookmarkController.getBookmarkById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockBookmarks });
    });
  });

  describe('createBookmark', () => {
    it('should create a bookmark with status 201', async () => {
      const mockBookmarks = [{ id: 1, title: 'Test Bookmark', url: 'http://example.com' }];
      bookmarkService.createBookmark.mockResolvedValue(mockBookmarks);

      const req = {
        headers: {
          "content-type": "application/json"
        },
        body: {
          title: 'Test Bookmark',
          url: 'http://example.com'
        }
      };


      await bookmarkController.createBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockBookmarks });
    });

    it('should throw ContentTypeMismatchError if content-type is not application/json', async () => {
      const req = {
        headers: {
          "content-type": "text/plain"
        },
        body: {
          title: 'Test Bookmark',
          url: 'http://example.com'
        }
      };
  
      await expect(bookmarkController.createBookmark(req, res)).rejects.toThrow('Content-Type must be application/json');
    });
  });

  describe('deleteBookmarkById', () => {
    it('should delete a bookmark and return status 204 when bookmark exists', async () => {
      bookmarkService.deleteBookmarkById.mockResolvedValue();

      const req = {
        params: {
          id: 1
        }
      };

      await bookmarkController.deleteBookmarkById(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});