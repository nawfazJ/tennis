import { assert, describe, expect, it } from 'vitest';
import { Result } from '../../src/shared-kernel/fp/result-pattern/result';
import type { PlayerRepository } from '../../src/domain/player.repository';
import { Player } from '../../src/domain/player';
import { getPlayersStatsHandler } from '../../src/application/get-players-stats.handler';

const makePlayer = (overrides: Partial<Player> & { id: number }): Player => ({
  firstname: `Player${overrides.id}`,
  lastname: 'Test',
  shortname: `P${overrides.id}`,
  sex: 'M',
  country: { code: 'FRA', picture: '' },
  picture: '',
  stats: { rank: 1, points: 0, weight: 80000, height: 180, age: 25, last: [1, 1, 1, 1, 1] },
  ...overrides,
});

const fakeRepository = (players: Player[]): PlayerRepository => ({
  findAll: async () => players,
  findById: async (id) => players.find((player) => player.id === id),
});

describe('getPlayersStatsHandler', () => {
  it('returns the country with the best win ratio, average BMI, and median height', async () => {
    // Arrange
    const players: Player[] = [
      makePlayer({
        id: 1,
        country: { code: 'FRA', picture: '' },
        stats: { rank: 1, points: 0, weight: 80000, height: 180, age: 25, last: [1, 0, 1, 0, 1] },
      }),
      makePlayer({
        id: 2,
        country: { code: 'USA', picture: '' },
        stats: { rank: 2, points: 0, weight: 70000, height: 170, age: 25, last: [1, 1, 1, 1, 1] },
      }),
    ];
    const handler = getPlayersStatsHandler(fakeRepository(players));

    // Act
    const result = await handler();

    // Assert
    assert(Result.isSuccess(result));
    expect(result.value.bestWinRatioCountry).toBe('USA');
    expect(result.value.averageBMI).toBeCloseTo(
      (80000 / 1000 / (1.8 * 1.8) + 70000 / 1000 / (1.7 * 1.7)) / 2,
      5,
    );
    expect(result.value.medianHeight).toBe(175);
  });

  it('returns a NoPlayersFound error when the repository has no players', async () => {
    // Arrange
    const handler = getPlayersStatsHandler(fakeRepository([]));

    // Act
    const result = await handler();

    // Assert
    assert(Result.isFailure(result));
    expect(result.error).toEqual({ type: 'NoPlayersFound' });
  });

  it('returns undefined for bestWinRatioCountry when no player has any match data, but still calculates the other stats', async () => {
    // Arrange
    const players: Player[] = [
      makePlayer({
        id: 1,
        country: { code: 'FRA', picture: '' },
        stats: { rank: 1, points: 0, weight: 80000, height: 180, age: 25, last: [] },
      }),
      makePlayer({
        id: 2,
        country: { code: 'USA', picture: '' },
        stats: { rank: 2, points: 0, weight: 70000, height: 170, age: 25, last: [] },
      }),
    ];
    const handler = getPlayersStatsHandler(fakeRepository(players));

    // Act
    const result = await handler();

    // Assert
    assert(Result.isSuccess(result));
    expect(result.value.bestWinRatioCountry).toBeUndefined();
    expect(result.value.averageBMI).toBeCloseTo(
      (80000 / 1000 / (1.8 * 1.8) + 70000 / 1000 / (1.7 * 1.7)) / 2,
      5,
    );
    expect(result.value.medianHeight).toBe(175);
  });
});
