import { type Failure, Result } from './result';
import { AsyncResult } from './async-result';

type OnFailure = <T, F1 extends Failure, F2 extends Failure, R>(
  fn: (result: F2) => Result<F1, R> | AsyncResult<F1, R>,
) => (asyncResult: AsyncResult<F2, T>) => AsyncResult<F1, R | T>;

const onFailure: OnFailure = (fn) => async (asyncResult) => {
  const result = await asyncResult;

  if (Result.isSuccess(result)) {
    return result;
  }

  return fn(result.error);
};

export { onFailure };
