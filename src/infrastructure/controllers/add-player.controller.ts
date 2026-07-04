import type { Request, Response } from 'express';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import type { AddPlayerHandler } from '../../application/add-player/add-player.handler';
import type { AddPlayerCommand } from '../../application/add-player/add-player.command';

const addPlayerController =
  (addPlayerHandler: AddPlayerHandler) =>
  async (req: Request<unknown, unknown, AddPlayerCommand>, res: Response) => {
    const result = await addPlayerHandler(req.body);

    if (Result.isSuccess(result)) {
      res.status(201).json(result.value);
      return;
    }

    res.status(400).json({ error: result.error.type, details: result.error });
  };

export { addPlayerController };
