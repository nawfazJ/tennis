declare const __brand__: unique symbol;

type BrandKey<T> = { readonly [__brand__]: T };
type TagKey<T> = { readonly __tag: T };

type Brand<B, T> = T & BrandKey<B>;
type TaggedBrand<B, T = object> = Brand<B, T & TagKey<B>>;

type IfNever<T, TIfNever, TElse> = [T] extends [never] ? TIfNever : TElse;

type ExtractBrandTag<T> = T extends { __tag: infer B extends string } ? B : never;

type UnionTags<T> = T extends TaggedBrand<string, any> ? ExtractBrandTag<T> : never;

type TWithCallback<T extends object, TWithBrand extends string, TWithResult> = (
  value: TaggedBrand<TWithBrand, T>,
) => TWithResult;

type TWith<T extends object, TBrands extends string, TResult> = <
  TWithBrand extends TBrands,
  TWithResult,
>(
  brand: TWithBrand,
  fn: TWithCallback<T, TWithBrand, TWithResult>,
) => MatchBrand<T, Exclude<TBrands, TWithBrand>, TResult | TWithResult>;

type TaggedBrands<TBrands extends string, T> = TBrands extends string
  ? TaggedBrand<TBrands, T>
  : never;

type TWithOneOfCallback<T extends object, TWithBrand extends string, TWithResult> = (
  value: TaggedBrands<TWithBrand, T>,
) => TWithResult;

type MatchBrand<T extends object, TBrands extends string, TResult> = {
  with: TWith<T, TBrands, TResult>;
  withOneOf: <TWithBrand extends TBrands, TWithResult>(
    brands: TWithBrand[],
    fn: TWithOneOfCallback<T, TWithBrand, TWithResult>,
  ) => MatchBrand<T, Exclude<TBrands, TWithBrand>, TResult | TWithResult>;
  get: <T extends TResult>(...b: IfNever<TBrands, never[], [never]>) => T;
};

const brand = <TBrand extends string, T>(value: T): Brand<TBrand, T> => value as Brand<TBrand, T>;

const tag = <TBrand extends string, T extends object | undefined | null>(
  tag: TBrand,
  value?: T,
): TaggedBrand<TBrand, T> => {
  if (value) {
    return { ...value, __tag: tag } as TaggedBrand<TBrand, T>;
  }

  return { __tag: tag } as TaggedBrand<TBrand, T>;
};

const getTag = <TBrand extends string, T extends object>(value: TaggedBrand<TBrand, T>): TBrand =>
  value.__tag as TBrand;

const isTagged = <TBrand extends string, T extends object>(
  tag: TBrand,
  value: T & { __tag?: unknown },
): value is TaggedBrand<TBrand, T> => value.__tag === tag;

const match = <T extends object>(value: T) => {
  const self = <T extends object, TBrands extends string, TResult>(
    value: T,
    result?: TResult,
  ): MatchBrand<T, TBrands, TResult> => ({
    with: <TWithBrand extends TBrands, TWithResult>(
      brand: TWithBrand,
      fn: TWithCallback<T, TWithBrand, TWithResult>,
    ): MatchBrand<T, TBrands, TResult> => {
      if (isTagged(brand, value)) {
        return self<T, never, TResult | TWithResult>(value, fn(value));
      }

      return self<T, Exclude<TBrands, TWithBrand>, TResult | TWithResult>(value, result);
    },
    withOneOf: <TWithBrand extends TBrands, TWithResult>(
      brands: TWithBrand[],
      fn: TWithOneOfCallback<T, TWithBrand, TWithResult>,
    ): MatchBrand<T, Exclude<TBrands, TWithBrand>, TResult | TWithResult> => {
      const matchedBrand = brands.find((brand) => isTagged(brand, value));

      if (matchedBrand) {
        return self<T, never, TResult | TWithResult>(
          value,
          fn(value as TaggedBrands<TWithBrand, T>),
        );
      }

      return self<T, Exclude<TBrands, TWithBrand>, TResult | TWithResult>(value, result);
    },
    get: <T extends TResult>() => result as IfNever<TBrands, T, never>,
  });

  return self<T, UnionTags<T>, never>(value);
};

export { brand, tag, getTag, isTagged, match };
export type { Brand, TaggedBrand, ExtractBrandTag };
