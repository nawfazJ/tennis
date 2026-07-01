import { isTagged, tag, type TaggedBrand } from './brand';

type Failure = { type: string };

type FailureResult<TFailure extends Failure> = TaggedBrand<
  'FailureResult',
  Readonly<{ error: TFailure }>
>;

type SuccessResult<TSuccess> = TaggedBrand<'SuccessResult', Readonly<{ value: TSuccess }>>;

type Result<TFailure extends Failure, TSuccess> = SuccessResult<TSuccess> | FailureResult<TFailure>;

type OnSuccess = <T, F1 extends Failure, F2 extends Failure, R>(
  fn: (result: T) => Result<F1, R>,
) => (result: Result<F2, T>) => Result<F1 | F2, R>;

type OnFailure = <T, R, F1 extends Failure, F2 extends Failure>(
  fn: (error: F2) => Result<F1, R>,
) => (result: Result<F2, T>) => Result<F1, T | R>;

const success = <TSuccess>(value: TSuccess): Result<never, TSuccess> =>
  tag('SuccessResult', { value });

const isSuccess = <TSuccess>(
  result: Result<Failure, TSuccess>,
): result is SuccessResult<TSuccess> => isTagged('SuccessResult', result);

const failure = <TFailure extends Failure>(error: TFailure): Result<TFailure, never> =>
  tag('FailureResult', { error });

const isFailure = <TFailure extends Failure>(
  result: Result<TFailure, unknown>,
): result is FailureResult<TFailure> => isTagged('FailureResult', result);

const onSuccess: OnSuccess = (fn) => (result) => {
  if (Result.isFailure(result)) {
    return result;
  }

  return fn(result.value);
};

const onFailure: OnFailure = (fn) => (result) => {
  if (Result.isSuccess(result)) {
    return result;
  }

  return fn(result.error);
};

type AssignOnSuccess = <K extends string, R, F1 extends Failure, T, F2 extends Failure>(
  key: K,
  fn: (result: T) => Result<F1, R>,
) => (result: Result<F2, T>) => Result<F1 | F2, T & Record<K, R>>;

const assignOnSuccess: AssignOnSuccess = (key, fn) => (result) => {
  if (Result.isFailure(result)) {
    return result;
  }

  const assignResult = fn(result.value);

  if (Result.isFailure(assignResult)) {
    return assignResult;
  }

  return Result.success({
    ...result.value,
    [key]: assignResult.value,
  } as typeof result.value & Record<typeof key, typeof assignResult.value>);
};

type Assign = <K extends string, R, F1 extends Failure>(
  key: K,
  fn: () => Result<F1, R>,
) => Result<F1, Record<K, R>>;

const assign: Assign = (key, fn) => {
  const assignResult = fn();

  if (Result.isFailure(assignResult)) {
    return assignResult;
  }

  return Result.success({
    [key]: assignResult.value,
  } as Record<typeof key, typeof assignResult.value>);
};

const match =
  <TFailure extends Failure, TSuccess, TResponseOnFailure, TResponseOnSuccess>(
    onFailureFn: (error: TFailure) => TResponseOnFailure,
    onSuccessFn: (value: TSuccess) => TResponseOnSuccess,
  ) =>
  (result: Result<TFailure, TSuccess>): TResponseOnFailure | TResponseOnSuccess => {
    if (Result.isSuccess(result)) {
      return onSuccessFn(result.value);
    }

    return onFailureFn(result.error);
  };

const getValue = <TSuccess>(result: SuccessResult<TSuccess>): TSuccess => result.value;

const Result = {
  isSuccess,
  isFailure,
  success,
  failure,
  onSuccess,
  onFailure,
  assignOnSuccess,
  assign,
  getValue,
  match,
};

export { Result };
export type { Failure, FailureResult };
