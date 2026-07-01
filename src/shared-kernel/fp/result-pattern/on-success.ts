import { type Failure, Result } from './result';
import { AsyncResult } from './async-result';

type OnSuccess = <T, F1 extends Failure, F2 extends Failure, R>(
  fn: (result: T) => Result<F1, R> | AsyncResult<F1, R>,
) => (asyncResult: AsyncResult<F2, T> | Result<F2, T>) => AsyncResult<F1 | F2, R>;

const onSuccess: OnSuccess = (fn) => async (asyncResult) => {
  const result = await asyncResult;

  if (Result.isFailure(result)) {
    return result;
  }

  return fn(result.value);
};

export { onSuccess };
