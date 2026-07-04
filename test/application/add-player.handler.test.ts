import { assert, describe, expect, it } from 'vitest';
import { Result } from '../../src/shared-kernel/fp/result-pattern/result';
import type { PlayerRepository } from '../../src/domain/player.repository';
import { addPlayerHandler } from '../../src/application/add-player/add-player.handler';
import type { AddPlayerCommand } from '../../src/application/add-player/add-player.command';
import { Player } from '../../src/domain/player';

const validCommand: AddPlayerCommand = {
  firstname: 'Carlos',
  lastname: 'Alcaraz',
  shortname: 'C.ALC',
  sex: 'M',
  countryCode: 'ESP',
  countryPicture: 'https://example.com/esp.png',
  picture: 'https://example.com/alcaraz.png',
  rank: 3,
  points: 2000,
  weight: 74000,
  height: 183,
  age: 21,
  last: [1, 1, 1, 1, 1],
};

const fakeRepository = (players: Player[]): PlayerRepository => ({
  findAll: async () => players,
  findById: async (id) => players.find((player) => player.id === id),
  add: async (player) => {
    players.push(player);
  },
});

describe('addPlayerHandler', () => {
  it('adds a new player successfully', async () => {
    // Arrange
    const existingPlayers = [
      {
        id: 17,
        firstname: 'Rafael',
        lastname: 'Nadal',
        shortname: 'R.NAD',
        sex: 'M' as const,
        country: { code: 'ESP', picture: '' },
        picture: '',
        stats: {
          rank: 1,
          points: 0,
          weight: 85000,
          height: 185,
          age: 33,
          last: [1, 0, 0, 0, 1] as (0 | 1)[],
        },
      },
    ];
    const repository = fakeRepository(existingPlayers);
    const handler = addPlayerHandler(repository);

    // Act
    const result = await handler(validCommand);

    // Assert
    assert(Result.isSuccess(result));
    expect(result.value.id).toBe(18);
    expect(result.value.firstname).toBe('Carlos');
    expect(result.value.country).toEqual({ code: 'ESP', picture: 'https://example.com/esp.png' });

    const players = await repository.findAll();
    expect(players).toHaveLength(2);
  });

  it.each([
    {
      field: 'rank',
      override: { rank: 0 },
      expectedError: { field: 'stats.rank', message: 'must be greater than 0' },
    },
    {
      field: 'points',
      override: { points: -1 },
      expectedError: { field: 'stats.points', message: 'must not be negative' },
    },
    {
      field: 'weight',
      override: { weight: 0 },
      expectedError: { field: 'stats.weight', message: 'must be greater than 0' },
    },
    {
      field: 'height',
      override: { height: 0 },
      expectedError: { field: 'stats.height', message: 'must be greater than 0' },
    },
    {
      field: 'age',
      override: { age: 0 },
      expectedError: { field: 'stats.age', message: 'must be greater than 0' },
    },
  ])(
    'returns a PlayerAddingError when $field violates its business rule',
    async ({ override, expectedError }) => {
      // Arrange
      const repository = fakeRepository([]);
      const handler = addPlayerHandler(repository);

      // Act
      const result = await handler({ ...validCommand, ...override });

      // Assert
      assert(Result.isFailure(result));
      expect(result.error).toEqual({
        type: 'PlayerAddingError',
        errors: [expectedError],
      });
    },
  );
});
