import { describe, it, expect, vi } from "vitest";
import bookmarkService from "../../src/services/bookmarkService";
import { db } from "../../src/db/db.js";
import { v4 as uuidv4 } from "uuid";

vi.mock("../../src/db/db.js");

describe("bookmarkService", () => {
  describe("getAllBookmarks", () => {
    it("should return all bookmarks", async () => {
      const mockBookmarks = [
        { id: uuidv4(), title: "Bookmark 1", url: "http://example.com/1" },
        { id: uuidv4(), title: "Bookmark 2", url: "http://example.com/2" },
      ];

      db.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(mockBookmarks),
      });

      const result = await bookmarkService.getAllBookmarks();
      expect(result).toEqual(mockBookmarks);
    });

    it("should return an empty array if no bookmarks are found", async () => {
      db.select.mockReturnValue({
        from: vi.fn().mockResolvedValue([]),
      });

      const result = await bookmarkService.getAllBookmarks();
      expect(result).toEqual([]);
    });
  });

  describe("getBookmarkById", () => {
    const id = uuidv4();
    it("should return the bookmark with the given id", async () => {
      const mockBookmark = {
        id,
        title: "Bookmark 1",
        url: "http://example.com",
      };

      db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockBookmark]),
        }),
      });

      const result = await bookmarkService.getBookmarkById(id);
      expect(result).toEqual(mockBookmark);
    });

    it("should throw NotFoundError if the bookmark is not found", async () => {
      db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        bookmarkService.getBookmarkById(id)
      ).rejects.toThrow("Bookmark not found");
    });

    it("should throw validation error if the id is not a valid GUID", async () => {
      await expect(bookmarkService.getBookmarkById("1")).rejects.toThrow(
        "Must be a valid GUID"
      );
    });
  });

  describe("createBookmark", () => {
    it("should create a new bookmark", async () => {
      const title = "Bookmark 1";
      const url = "http://example.com/1";
      const id = uuidv4();

      db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi
            .fn()
            .mockResolvedValue([
              { id, title, url },
            ]),
        }),
      });

      const result = await bookmarkService.createBookmark(title, url);
      expect(result).toEqual({
        id,
        title,
        url,
      });
    });

    it("should throw ConflictError if a bookmark with the same URL already exists", async () => {
      const id = uuidv4();
      db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id,
              title: "Bookmark 1",
              url: "http://example.com/1",
            },
          ]),
        }),
      });

      await expect(
        bookmarkService.createBookmark("Bookmark 1", "http://example.com/1")
      ).rejects.toThrow("Bookmark with this URL already exists");
    });

    it("should throw validation error if the input data is invalid", async () => {
      await expect(bookmarkService.createBookmark("", "")).rejects.toThrow();
    });
  });

  describe("deleteBookmarkById", () => {
    it("should delete the bookmark with the given id", async () => {
      const id = uuidv4();
      const mockBookmark = {
        id,
        title: "Bookmark 1",
        url: "http://example.com",
      };

      db.delete.mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockBookmark]),
        }),
      });

      const result = await bookmarkService.deleteBookmarkById(id);
      expect(result).toEqual(1);
    });

    it("should throw NotFoundError if the bookmark is not found", async () => {
      const id = uuidv4();
      db.delete.mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        bookmarkService.deleteBookmarkById(id)
      ).rejects.toThrow("Bookmark not found");
    });

    it("should throw validation error if the id is not a valid GUID", async () => {
      await expect(bookmarkService.deleteBookmarkById("1")).rejects.toThrow(
        "Must be a valid GUID"
      );
    });
  });
});
