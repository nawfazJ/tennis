import { Router } from 'express';
import type { Dependencies } from '../../dependencies.container';
import { getBestPlayersController } from '../../controllers/get-best-players.controller';
import { getPlayerByIdController } from '../../controllers/get-player.controller';
import { getPlayersStatsController } from '../../controllers/get-players-stats.controller';
import { addPlayerController } from '../../controllers/add-player.controller';
import { addPlayerSchema } from '../schemas/add-player.schema';
import { validateBody } from '../middleware/validate-body.middleware';
import { getPlayerByIdParamsSchema } from '../schemas/get-player-by-id.schema';
import { validateParams } from '../middleware/validate-params.middleware';

const playersRouter = (dependencies: Dependencies): Router => {
  const router = Router();

  // Auth can be added as middleware
  router.get('/players', getBestPlayersController(dependencies.getBestPlayersHandler));
  router.get(
    '/players/:id',
    validateParams(getPlayerByIdParamsSchema),
    getPlayerByIdController(dependencies.getPlayerByIdHandler),
  );
  router.get('/stats', getPlayersStatsController(dependencies.getPlayersStatsHandler));
  router.post(
    '/players',
    validateBody(addPlayerSchema),
    addPlayerController(dependencies.addPlayerHandler),
  );
  return router;
};

export { playersRouter };
