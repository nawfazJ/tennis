import { assert, describe, expect, it } from 'vitest';
import type { Player } from '../../src/domain/player';
import type { PlayerRepository } from '../../src/domain/player.repository';
import { getBestPlayersHandler } from '../../src/application/get-best-players/get-best-players.handler';
import { Result } from '../../src/shared-kernel/fp/result-pattern/result';

const createPlayer = (id: number, rank: number): Player => ({
  id,
  firstname: `Player${id}`,
  lastname: 'Test',
  shortname: `P${id}`,
  sex: 'M',
  country: { code: 'FRA', picture: '' },
  picture: '',
  stats: { rank, points: 0, weight: 80000, height: 180, age: 25, last: [1, 1, 0, 1, 0] },
});

const fakeRepository = (players: Player[]): PlayerRepository => ({
  findAll: async () => players,
});

describe('getBestPlayers use case', () => {
  it('returns players sorted from best to worst', async () => {
    // Arrange
    const players = [createPlayer(1, 21), createPlayer(2, 1), createPlayer(3, 52)];
    const repository = fakeRepository(players);

    // Act
    const result = await getBestPlayersHandler(repository)();

    // Assert
    assert(Result.isSuccess(result));
    expect(result.value.map((p) => p.id)).toEqual([2, 1, 3]);
  });

  it('returns a NoPlayersFound error when the repository has no players', async () => {
    // Arrange
    const repository = fakeRepository([]);

    // Act
    const result = await getBestPlayersHandler(repository)();

    // Assert
    assert(Result.isFailure(result));
    expect(result.error).toEqual({ type: 'NoPlayersFound' });
  });
});
