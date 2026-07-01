import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/infrastructure/http/app';
import { Result } from '../../../src/shared-kernel/fp/result-pattern/result';
import type { GetBestPlayersHandler } from '../../../src/application/get-best-players/get-best-players.handler';
import type { Dependencies } from '../../../src/infrastructure/dependencies.container';

const makeTestDependencies = (getBestPlayersHandler: GetBestPlayersHandler) =>
  ({ getBestPlayersHandler }) as Dependencies;

describe('GET /players', () => {
  it('returns 200 with the sorted players on success', async () => {
    // Arrange
    const players = [
      { id: 2, firstname: 'Rafael', lastname: 'Nadal' },
      { id: 1, firstname: 'Novak', lastname: 'Djokovic' },
    ];
    const getBestPlayersHandler = vi.fn().mockResolvedValue(Result.success(players));
    const app = createApp(makeTestDependencies(getBestPlayersHandler));

    // Act
    const response = await request(app).get('/players');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(players);
  });

  it('returns 404 when no players are found', async () => {
    // Arrange
    const getBestPlayersHandler = vi
      .fn()
      .mockResolvedValue(Result.failure({ type: 'NoPlayersFound' }));
    const app = createApp(makeTestDependencies(getBestPlayersHandler));

    // Act
    const response = await request(app).get('/players');

    // Assert
    expect(response.status).toBe(404);
  });
});
