import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { rateLimiter } from '../../src/middleware/rateLimiter.js';

// Mock store
const mockStore = {
  store: new Map(),
  currentTime: Date.now(),
  reset() {
    this.store.clear();
    this.currentTime = Date.now();
  }
};

// Mock express-rate-limit
vi.mock('express-rate-limit', () => ({
  default: vi.fn().mockImplementation(({ windowMs, limit, handler }) => {
    return (req, res, next) => {
      const key = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';
      let record = mockStore.store.get(key) || { requests: 0, resetTime: mockStore.currentTime + windowMs };

      if (mockStore.currentTime >= record.resetTime) {
        record = { requests: 0, resetTime: mockStore.currentTime + windowMs };
      }

      record.requests++;
      mockStore.store.set(key, record);

      res.setHeader('RateLimit-Limit', limit);
      res.setHeader('RateLimit-Remaining', Math.max(0, limit - record.requests));
      res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      return record.requests > limit ? handler(req, res) : next();
    };
  })
}));

describe('Rate Limiter Middleware', () => {
  let app;
  let advanceTime;

  beforeEach(() => {
    mockStore.reset();
    app = express();
    app.use(rateLimiter);
    app.all('/test', (req, res) => res.status(200).json({ message: 'success' }));

    advanceTime = (minutes) => {
      mockStore.currentTime += minutes * 60 * 1000;
      vi.advanceTimersByTime(minutes * 60 * 1000);
    };

    vi.useFakeTimers();
  });

  afterEach(() => {
    mockStore.reset();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Helper function to send requests
  const makeRequests = async (count, method = 'get', ip = '127.0.0.1') =>
    Promise.all(Array(count).fill().map(() => request(app)[method]('/test').set('X-Forwarded-For', ip)));

  it('allows requests within the limit and blocks excess', async () => {
    const responses = await makeRequests(101);
    expect(responses.filter(r => r.status === 200)).toHaveLength(100);
    expect(responses.filter(r => r.status === 429)).toHaveLength(1);
  });

  it('resets limit after window expires', async () => {
    await makeRequests(100);
    advanceTime(15);
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
  });

  it('tracks different IPs separately', async () => {
    await makeRequests(100, 'get', '1.1.1.1');
    expect((await request(app).get('/test').set('X-Forwarded-For', '1.1.1.1')).status).toBe(429);
    expect((await request(app).get('/test').set('X-Forwarded-For', '2.2.2.2')).status).toBe(200);
  });

  it('should apply rate limit across all HTTP methods', async () => {
    const methods = ['get', 'post', 'put', 'delete'];
    const requests = [];
  
    for (const method of methods) {
      const methodRequests = Array(25).fill().map(() =>
        request(app)[method]('/test')
      );
      requests.push(...methodRequests);
    }
    
    const responses = await Promise.all(requests);
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    const blockedResponse = await request(app).get('/test');
    expect(blockedResponse.status).toBe(429);
  });

  it('handles burst traffic correctly', async () => {
    await makeRequests(50);
    advanceTime(5);
    await makeRequests(40);
    advanceTime(5);
    const finalResponses = await makeRequests(20);
    expect(finalResponses.filter(r => r.status === 200)).toHaveLength(10);
    expect(finalResponses.filter(r => r.status === 429)).toHaveLength(10);
  });
});
