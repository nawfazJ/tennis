import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/infrastructure/http/app';
import { Result } from '../../../src/shared-kernel/fp/result-pattern/result';
import type { AddPlayerHandler } from '../../../src/application/add-player/add-player.handler';
import type { Dependencies } from '../../../src/infrastructure/dependencies.container';

const makeTestDependencies = (addPlayerHandler: AddPlayerHandler) =>
  ({ addPlayerHandler }) as Dependencies;

const validCommand = {
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

describe('POST /players', () => {
  it('returns 201 with the created player on success', async () => {
    // Arrange
    const createdPlayer = { id: 18, firstname: 'Carlos', lastname: 'Alcaraz' };
    const addPlayerHandler = vi.fn().mockResolvedValue(Result.success(createdPlayer));
    const app = createApp(makeTestDependencies(addPlayerHandler));

    // Act
    const response = await request(app).post('/players').send(validCommand);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdPlayer);
    expect(addPlayerHandler).toHaveBeenCalledWith(validCommand);
  });

  it('returns 400 when a business rule is violated', async () => {
    // Arrange
    const addPlayerHandler = vi.fn().mockResolvedValue(
      Result.failure({
        type: 'PlayerAddingError',
        errors: [{ field: 'stats.weight', message: 'must be greater than 0' }],
      }),
    );
    const app = createApp(makeTestDependencies(addPlayerHandler));

    // Act
    const response = await request(app)
      .post('/players')
      .send({ ...validCommand, weight: 0 });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('PlayerAddingError');
  });

  it('returns 400 when the request body is malformed', async () => {
    // Arrange
    const addPlayerHandler = vi.fn();
    const app = createApp(makeTestDependencies(addPlayerHandler));

    // Act
    const response = await request(app)
      .post('/players')
      .send({ ...validCommand, sex: 'X' });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('InvalidRequestBody');
    expect(addPlayerHandler).not.toHaveBeenCalled();
  });

  it('returns 409 when a player with the same name already exists', async () => {
    // Arrange
    const addPlayerHandler = vi.fn().mockResolvedValue(
      Result.failure({
        type: 'PlayerAlreadyExists',
        firstname: 'Carlos',
        lastname: 'Alcaraz',
      }),
    );
    const app = createApp(makeTestDependencies(addPlayerHandler));

    // Act
    const response = await request(app).post('/players').send(validCommand);

    // Assert
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('PlayerAlreadyExists');
  });
});
