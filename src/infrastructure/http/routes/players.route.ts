import { Router } from 'express';
import type { Dependencies } from '../../dependencies.container';
import { getBestPlayersController } from '../../controllers/get-best-players.controller';
import { getPlayerByIdController } from '../../controllers/get-player.controller';
import { getPlayersStatsController } from '../../controllers/get-players-stats.controller';

const playersRouter = (dependencies: Dependencies): Router => {
  const router = Router();
  router.get('/players', getBestPlayersController(dependencies.getBestPlayersHandler));
  router.get('/players/:id', getPlayerByIdController(dependencies.getPlayerByIdHandler));
  router.get('/stats', getPlayersStatsController(dependencies.getPlayersStatsHandler));
  return router;
};

export { playersRouter };
