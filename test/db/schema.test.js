import { describe, it, expect } from 'vitest';
import { bookmark } from '../../src/db/schema.js';

describe('bookmark schema', () => {
  it('should have correct table name', () => {
    expect(bookmark[Symbol.for('drizzle:Name')]).toBe('bookmark');
  });

  it('should have id column with correct configuration', () => {
    const idColumn = bookmark.id;
    expect(idColumn.name).toBe('id');
    expect(idColumn.primary).toBe(true);
    expect(idColumn.notNull).toBe(true);
    expect(idColumn.columnType).toBe('PgUUID');
  });

  it('should have title column with correct configuration', () => {
    const titleColumn = bookmark.title;
    expect(titleColumn.name).toBe('title');
    expect(titleColumn.primary).toBe(false);
    expect(titleColumn.notNull).toBe(false);
    expect(titleColumn.columnType).toBe('PgText');
  });

  it('should have url column with correct configuration', () => {
    const urlColumn = bookmark.url;
    expect(urlColumn.name).toBe('url');
    expect(urlColumn.primary).toBe(false);
    expect(urlColumn.notNull).toBe(false);
    expect(urlColumn.columnType).toBe('PgVarchar');
    expect(urlColumn.length).toBe(256);
  });
});