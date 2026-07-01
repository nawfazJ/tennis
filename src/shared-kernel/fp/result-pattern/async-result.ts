import { type Failure, Result } from './result';
import { onSuccess } from './on-success';
import { onFailure } from './on-failure';

type AsyncResult<TFailure extends Failure, TSuccess> = Promise<Result<TFailure, TSuccess>>;

const match =
  <TFailure extends Failure, TSuccess, TResponseOnFailure, TResponseOnSuccess>(
    onFailureFn: (error: TFailure) => TResponseOnFailure,
    onSuccessFn: (value: TSuccess) => TResponseOnSuccess,
  ) =>
  async (
    asyncResult: AsyncResult<TFailure, TSuccess>,
  ): Promise<TResponseOnFailure | TResponseOnSuccess> => {
    const result = await asyncResult;

    if (Result.isSuccess(result)) {
      return onSuccessFn(result.value);
    }

    return onFailureFn(result.error);
  };

const AsyncResult = {
  onSuccess,
  onFailure,
  match,
};

export { AsyncResult };
