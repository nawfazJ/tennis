import pino, { type LoggerOptions } from 'pino';
import type { Logger } from './logger.port';

const createPinoLogger = (): Logger => {
  const isProduction = process.env['NODE_ENV'] === 'production';

  const options: LoggerOptions = {
    level: process.env['LOG_LEVEL'] ?? 'info',
    ...(isProduction
      ? {}
      : {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        }),
  };

  const instance = pino(options);

  return {
    info: (message, meta) => instance.info(meta ?? {}, message),
    warn: (message, meta) => instance.warn(meta ?? {}, message),
    error: (message, meta) => instance.error(meta ?? {}, message),
  };
};

export { createPinoLogger };
