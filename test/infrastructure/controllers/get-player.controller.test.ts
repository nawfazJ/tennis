import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/infrastructure/http/app';
import { Result } from '../../../src/shared-kernel/fp/result-pattern/result';
import type { Dependencies } from '../../../src/infrastructure/dependencies.container';
import type { GetPlayerByIdHandler } from '../../../src/application/get-player/get-player';

const makeTestDependencies = (getPlayerByIdHandler: GetPlayerByIdHandler) =>
  ({ getPlayerByIdHandler }) as Dependencies;

describe('GET /players/:id', () => {
  it('returns 200 with the player when found', async () => {
    // Arrange
    const player = { id: 17, firstname: 'Rafael', lastname: 'Nadal' };
    const getPlayerByIdHandler = vi.fn().mockResolvedValue(Result.success(player));
    const app = createApp(makeTestDependencies(getPlayerByIdHandler));

    // Act
    const response = await request(app).get('/players/17');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(player);
    expect(getPlayerByIdHandler).toHaveBeenCalledWith({ id: 17 });
  });

  it('returns 404 when no player matches the id', async () => {
    // Arrange
    const getPlayerByIdHandler = vi
      .fn()
      .mockResolvedValue(Result.failure({ type: 'PlayerNotFound', id: 999 }));
    const app = createApp(makeTestDependencies(getPlayerByIdHandler));

    // Act
    const response = await request(app).get('/players/999');

    // Assert
    expect(response.status).toBe(404);
  });

  it('returns 400 when the id is not a positive integer', async () => {
    // Arrange
    const getPlayerByIdHandler = vi.fn();
    const app = createApp(makeTestDependencies(getPlayerByIdHandler));

    // Act
    const response = await request(app).get('/players/abc');

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('InvalidRequestParams');
    expect(getPlayerByIdHandler).not.toHaveBeenCalled();
  });
});
