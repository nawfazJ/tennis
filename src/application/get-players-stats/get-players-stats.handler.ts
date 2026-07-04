import { Result } from '../../shared-kernel/fp/result-pattern/result';
import { DomainError } from '../../domain/errors/error.base';
import { PlayerRepository } from '../../domain/player.repository';
import { hasPlayers } from '../../domain/player';
import { noPlayersFound } from '../../domain/errors/no-players-found.error';
import {
  averageBMI,
  bestWinRatioCountry,
  medianHeight,
  PlayersStats,
} from '../../domain/player-stats';

type GetPlayersStatsHandler = () => Promise<Result<DomainError, PlayersStats>>;

const getPlayersStatsHandler =
  (playerRepository: PlayerRepository): GetPlayersStatsHandler =>
  async () => {
    const players = await playerRepository.findAll();

    if (!hasPlayers(players)) {
      return Result.failure(noPlayersFound());
    }

    return Result.success({
      bestWinRatioCountry: bestWinRatioCountry(players),
      averageBMI: averageBMI(players),
      medianHeight: medianHeight(players),
    });
  };

export { getPlayersStatsHandler };
export type { GetPlayersStatsHandler };
