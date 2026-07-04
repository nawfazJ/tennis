import type { Request, Response } from 'express';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import { GetPlayerByIdHandler } from '../../application/get-player/get-player';
import { GetPlayerByIdQuery } from '../../application/get-player/get-player.query';

const getPlayerByIdController =
  (getPlayerByIdHandler: GetPlayerByIdHandler) => async (req: Request, res: Response) => {
    const id = Number(req.params['id']);
    const query: GetPlayerByIdQuery = {
      id,
    };

    const result = await getPlayerByIdHandler(query);

    if (Result.isSuccess(result)) {
      res.status(200).json(result.value);
      return;
    }

    res.status(404).json({ error: result.error.type });
  };

export { getPlayerByIdController };
