import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/infrastructure/http/app';
import { Result } from '../../../src/shared-kernel/fp/result-pattern/result';
import type { Dependencies } from '../../../src/infrastructure/dependencies.container';
import { GetPlayersStatsHandler } from '../../../src/application/get-players-stats.handler';

const makeTestDependencies = (getPlayersStatsHandler: GetPlayersStatsHandler) =>
  ({ getPlayersStatsHandler }) as Dependencies;

describe('GET /stats', () => {
  it('returns 200 with the aggregated stats on success', async () => {
    // Arrange
    const stats = {
      bestWinRatioCountry: 'USA',
      averageBMI: 23.5,
      medianHeight: 180,
    };
    const getPlayersStatsHandler = vi.fn().mockResolvedValue(Result.success(stats));
    const app = createApp(makeTestDependencies(getPlayersStatsHandler));

    // Act
    const response = await request(app).get('/stats');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(stats);
  });

  it('returns 404 when no players are found', async () => {
    // Arrange
    const getPlayersStatsHandler = vi
      .fn()
      .mockResolvedValue(Result.failure({ type: 'NoPlayersFound' }));
    const app = createApp(makeTestDependencies(getPlayersStatsHandler));

    // Act
    const response = await request(app).get('/stats');

    // Assert
    expect(response.status).toBe(404);
  });
});
