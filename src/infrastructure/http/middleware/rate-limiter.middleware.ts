import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TooManyRequests' },
});

export { rateLimiter };
