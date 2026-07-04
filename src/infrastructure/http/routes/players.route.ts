import { Router } from 'express';
import type { Dependencies } from '../../dependencies.container';
import { getBestPlayersController } from '../../controllers/get-best-players.controller';
import { getPlayerByIdController } from '../../controllers/get-player.controller';
import { getPlayersStatsController } from '../../controllers/get-players-stats.controller';
import { addPlayerController } from '../../controllers/add-player.controller';

const playersRouter = (dependencies: Dependencies): Router => {
  const router = Router();

  // Auth can be added as middleware
  router.get('/players', getBestPlayersController(dependencies.getBestPlayersHandler));
  router.get('/players/:id', getPlayerByIdController(dependencies.getPlayerByIdHandler));
  router.get('/stats', getPlayersStatsController(dependencies.getPlayersStatsHandler));
  router.post('/players', addPlayerController(dependencies.addPlayerHandler));
  return router;
};

export { playersRouter };
