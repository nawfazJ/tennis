import type { PlayerRepository } from '../../domain/player.repository';
import type { DomainError } from '../../domain/errors/error.base';
import { createPlayer, Player, PlayerInput } from '../../domain/player';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import type { AddPlayerCommand } from './add-player.command';
import { playerAlreadyExists } from '../../domain/errors/player-already-exists.error';

type AddPlayerHandler = (command: AddPlayerCommand) => Promise<Result<DomainError, Player>>;

const nextId = (players: Player[]): number =>
  players.length === 0 ? 1 : Math.max(...players.map((player) => player.id)) + 1;

const toPlayerInput = (command: AddPlayerCommand): PlayerInput => ({
  firstname: command.firstname,
  lastname: command.lastname,
  shortname: command.shortname,
  sex: command.sex,
  country: { code: command.countryCode, picture: command.countryPicture },
  picture: command.picture,
  stats: {
    rank: command.rank,
    points: command.points,
    weight: command.weight,
    height: command.height,
    age: command.age,
    last: command.last,
  },
});

const alreadyExists = (players: Player[], firstname: string, lastname: string): boolean =>
  players.some((player) => player.firstname === firstname && player.lastname === lastname);

const addPlayerHandler =
  (playerRepository: PlayerRepository): AddPlayerHandler =>
  async (command) => {
    const existingPlayers = await playerRepository.findAll();

    if (alreadyExists(existingPlayers, command.firstname, command.lastname)) {
      return Result.failure(playerAlreadyExists(command.firstname, command.lastname));
    }

    const id = nextId(existingPlayers);

    const result = createPlayer(toPlayerInput(command), id);

    if (Result.isFailure(result)) {
      return result;
    }

    await playerRepository.add(result.value);

    return Result.success(result.value);
  };

export { addPlayerHandler };
export type { AddPlayerHandler };
