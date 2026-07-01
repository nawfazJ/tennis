import type { Config } from './app.config.schema';

const getAppConfig = (): Config => ({
  PORT: Number(process.env['PORT'] ?? 3000),
});

export { getAppConfig };
