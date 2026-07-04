export type ValidationError = Readonly<{ field: string; message: string }>;

type DomainError =
  | Readonly<{ type: 'NoPlayersFound' }>
  | Readonly<{ type: 'PlayerNotFound'; id: number }>
  | Readonly<{ type: 'PlayerAddingError'; errors: ReadonlyArray<ValidationError> }>
  | Readonly<{ type: 'PlayerAlreadyExists'; firstname: string; lastname: string }>;

export { type DomainError };
