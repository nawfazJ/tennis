import type { PlayerRepository } from '../../domain/player.repository';
import type { DomainError } from '../../domain/errors/error.base';
import type { Player } from '../../domain/player';
import { hasPlayers, rankPlayersFromBestToWorst } from '../../domain/player';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import { noPlayersFound } from '../../domain/errors/no-players-found.error';

type GetBestPlayersHandler = () => Promise<Result<DomainError, Player[]>>;

const getBestPlayersHandler =
  (playerRepository: PlayerRepository): GetBestPlayersHandler =>
  async () => {
    const players = await playerRepository.findAll();

    if (hasPlayers(players)) {
      return Result.success(rankPlayersFromBestToWorst(players));
    }

    return Result.failure(noPlayersFound());
  };

export { getBestPlayersHandler };
export type { GetBestPlayersHandler };
