import type { Request, Response } from 'express';
import { Result } from '../../shared-kernel/fp/result-pattern/result';
import type { AddPlayerHandler } from '../../application/add-player/add-player.handler';
import type { AddPlayerCommand } from '../../application/add-player/add-player.command';
import type { DomainError } from '../../domain/errors/error.base';

const errorToStatusCode = (error: DomainError): number => {
  if (error.type === 'PlayerAlreadyExists') return 409;
  return 400;
};

const addPlayerController =
  (addPlayerHandler: AddPlayerHandler) =>
  async (req: Request<unknown, unknown, AddPlayerCommand>, res: Response) => {
    const result = await addPlayerHandler(req.body);

    if (Result.isSuccess(result)) {
      res.status(201).json(result.value);
      return;
    }

    res
      .status(errorToStatusCode(result.error))
      .json({ error: result.error.type, details: result.error });
  };

export { addPlayerController };
