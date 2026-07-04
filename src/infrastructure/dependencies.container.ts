import type { Player } from '../domain/player';
import {
  getBestPlayersHandler,
  type GetBestPlayersHandler,
} from '../application/get-best-players/get-best-players.handler';
import { inMemoryPlayerRepository } from './repositories/in-memory-player.repository';
import type { Logger } from './logger/logger.port';
import { createPinoLogger } from './logger/pino-logger.adapter';
import { getPlayerByIdHandler, GetPlayerByIdHandler } from '../application/get-player/get-player';
import { getPlayersStatsHandler, GetPlayersStatsHandler, } from '../application/get-players-stats.handler';
import { addPlayerHandler, AddPlayerHandler } from '../application/add-player/add-player.handler';

type Dependencies = {
  logger: Logger;
  getBestPlayersHandler: GetBestPlayersHandler;
  getPlayerByIdHandler: GetPlayerByIdHandler;
  getPlayersStatsHandler: GetPlayersStatsHandler;
  addPlayerHandler: AddPlayerHandler;
};

const createRepositories = (players: Player[]) => ({
  playerRepository: inMemoryPlayerRepository,
});

const createHandlers = (repositories: ReturnType<typeof createRepositories>) => ({
  getBestPlayersHandler: getBestPlayersHandler(repositories.playerRepository),
  getPlayerByIdHandler: getPlayerByIdHandler(repositories.playerRepository),
  getPlayersStatsHandler: getPlayersStatsHandler(repositories.playerRepository),
  addPlayerHandler: addPlayerHandler(repositories.playerRepository),
});

const createDependenciesContainer = (players: Player[] = []): Dependencies => {
  const repositories = createRepositories(players);
  const handlers = createHandlers(repositories);

  return {
    logger: createPinoLogger(),
    getBestPlayersHandler: handlers.getBestPlayersHandler,
    getPlayerByIdHandler: handlers.getPlayerByIdHandler,
    getPlayersStatsHandler: handlers.getPlayersStatsHandler,
    addPlayerHandler: handlers.addPlayerHandler,
  };
};

export { createDependenciesContainer };
export type { Dependencies };
