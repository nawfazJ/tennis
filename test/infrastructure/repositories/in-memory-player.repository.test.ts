import { describe, expect, it } from 'vitest';
import { inMemoryPlayerRepository } from '../../../src/infrastructure/repositories/in-memory-player.repository';

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
});
