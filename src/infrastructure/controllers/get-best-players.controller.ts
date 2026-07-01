import type { Request, Response } from 'express';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import type { GetBestPlayersHandler } from '../../application/get-best-players/get-best-players.handler';

const getBestPlayersController =
  (getBestPlayersHandler: GetBestPlayersHandler) => async (_req: Request, res: Response) => {
    const result = await getBestPlayersHandler();

    if (Result.isSuccess(result)) {
      res.status(200).json(result.value);
      return;
    }

    res.status(404).json({ error: result.error.type });
  };

export { getBestPlayersController };
