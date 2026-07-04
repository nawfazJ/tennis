import type { Request, Response } from 'express';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import { GetPlayersStatsHandler } from '../../application/get-players-stats.handler';

const getPlayersStatsController =
  (getPlayersStatsHandler: GetPlayersStatsHandler) => async (_req: Request, res: Response) => {
    const result = await getPlayersStatsHandler();

    if (Result.isSuccess(result)) {
      res.status(200).json(result.value);
      return;
    }

    res.status(404).json({ error: result.error.type });
  };

export { getPlayersStatsController };
