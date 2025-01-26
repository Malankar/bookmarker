import request from 'supertest';
import express from 'express';
import bookmarkRoutes from '../../src/routes/bookmarkRoutes.js';

const app = express();
app.use(express.json());
app.use('/', bookmarkRoutes);

describe('Rate Limiting', () => {
	it('should allow up to 100 requests within 15 minutes', async () => {
		for (let i = 0; i < 100; i++) {
			const res = await request(app).post('/bookmarks');
			expect(res.status).not.toBe(429);
		}
	});

	it('should block requests after exceeding the limit', async () => {
		for (let i = 0; i < 100; i++) {
			await request(app).post('/bookmarks');
		}
		const res = await request(app).post('/bookmarks');
		expect(res.status).toBe(429);
		expect(res.body).toEqual({
			error: "Too many requests, please try again later."
		});
	});
});