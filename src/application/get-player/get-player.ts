import type { PlayerRepository } from '../../domain/player.repository';
import type { DomainError } from '../../domain/errors/error.base';
import type { Player } from '../../domain/player';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import { playerNotFound } from '../../domain/errors/player-not-found.error';
import { GetPlayerByIdQuery } from './get-player.query';

type GetPlayerByIdHandler = (query: GetPlayerByIdQuery) => Promise<Result<DomainError, Player>>;

const getPlayerByIdHandler =
  (playerRepository: PlayerRepository): GetPlayerByIdHandler =>
  async (query) => {
    const player = await playerRepository.findById(query.id);

    if (player) {
      return Result.success(player);
    }

    return Result.failure(playerNotFound(query.id));
  };

export { getPlayerByIdHandler };
export type { GetPlayerByIdHandler };
