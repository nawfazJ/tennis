import { assert, describe, expect, it } from 'vitest';
import { Result } from '../../src/shared-kernel/fp/result-pattern/result';
import type { PlayerRepository } from '../../src/domain/player.repository';
import { Player } from '../../src/domain/player';
import { getPlayerByIdHandler } from '../../src/application/get-player/get-player';
import { GetPlayerByIdQuery } from '../../src/application/get-player/get-player.query';

const makePlayer = (id: number): Player => ({
  id,
  firstname: `Player${id}`,
  lastname: 'Test',
  shortname: `P${id}`,
  sex: 'M',
  country: { code: 'FRA', picture: '' },
  picture: '',
  stats: { rank: 1, points: 0, weight: 80000, height: 180, age: 25, last: [1, 1, 0, 1, 0] },
});

const fakeRepository = (players: Player[]): PlayerRepository => ({
  findAll: async () => players,
  findById: async (id) => players.find((player) => player.id === id),
});

describe('getPlayerByIdHandler', () => {
  it('returns the player when found', async () => {
    // Arrange
    const players = [makePlayer(1), makePlayer(2)];
    const handler = getPlayerByIdHandler(fakeRepository(players));
    const query: GetPlayerByIdQuery = { id: 2 };

    // Act
    const result = await handler(query);

    // Assert
    assert(Result.isSuccess(result));
    expect(result.value.id).toBe(2);
  });

  it('returns a PlayerNotFound error when no player matches the id', async () => {
    // Arrange
    const players = [makePlayer(1)];
    const handler = getPlayerByIdHandler(fakeRepository(players));
    const query: GetPlayerByIdQuery = { id: 999 };

    // Act
    const result = await handler(query);

    // Assert
    assert(Result.isFailure(result));
    expect(result.error).toEqual({ type: 'PlayerNotFound', id: 999 });
  });
});
