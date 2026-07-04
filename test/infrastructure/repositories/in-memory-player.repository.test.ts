import { describe, expect, it } from 'vitest';
import { inMemoryPlayerRepository } from '../../../src/infrastructure/repositories/in-memory-player.repository';
import { Player } from '../../../src/domain/player';

const makePlayer = (id: number): Player => ({
  id,
  firstname: 'New',
  lastname: 'Player',
  shortname: 'N.PLA',
  sex: 'M',
  country: { code: 'FRA', picture: '' },
  picture: '',
  stats: { rank: 999, points: 0, weight: 80000, height: 180, age: 25, last: [] },
});

describe('inMemoryPlayerRepository', () => {
  it('returns all players', async () => {
    // Act
    const players = await inMemoryPlayerRepository.findAll();

    // Assert
    expect(players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 17,
          firstname: 'Rafael',
          lastname: 'Nadal',
        }),
      ]),
    );
    expect(players).toHaveLength(5);
  });

  it('adds a new player', async () => {
    // Arrange
    const newPlayer = makePlayer(9999);

    // Act
    await inMemoryPlayerRepository.add(newPlayer);
    const found = await inMemoryPlayerRepository.findById(9999);

    // Assert
    expect(found).toEqual(newPlayer);
  });
});
